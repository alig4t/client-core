# RNT Social API - Frontend Integration Guide

Complete API documentation for the Dynamic Rule Engine and Notification System.

**Last Updated:** December 2025
**Base URL:** `http://localhost:8080/api`
**Auth:** Bearer Token (JWT)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Platform Authorization Flow](#platform-authorization-flow)
3. [Notification Channels](#notification-channels)
4. [Dynamic Rules](#dynamic-rules)
5. [Keywords & Monitoring](#keywords--monitoring)
6. [Complete Integration Example](#complete-integration-example)
7. [WebSocket Real-time Updates](#websocket-real-time-updates)

---

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@12345"
}
```

**Response:**
```json
{
  "type": "data",
  "status": 200,
  "data": {
    "token": "eyJhbGciOiJIUzM4NCJ9...",
    "user": {
      "id": 2,
      "username": "admin",
      "name": "System Administrator"
    }
  }
}
```

**Use token in all requests:**
```http
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
```

---

## Platform Authorization Flow

This is how users connect their messaging platform chats (Bale/Telegram) to the system.

### Two Types of Authorization:

| Type | Code Prefix | Purpose | Used For |
|------|-------------|---------|----------|
| **MONITORING_CHANNEL** | `RNT-XXXX-XXXX` | Receive messages to analyze | Keyword detection, message monitoring |
| **NOTIFICATION_CHANNEL** | `NTF-XXXX-XXXX` | Send alerts/notifications | Rule alerts, reports, notifications |

### Step 1: Create Authorization Draft

```http
POST /api/platform-authorizations/draft
Authorization: Bearer {token}
Content-Type: application/json

{
  "platformKey": "bale-main",
  "chatTitle": "My Monitoring Chat",
  "authorizationType": "MONITORING_CHANNEL"
}
```

**Response:**
```json
{
  "type": "data",
  "status": 200,
  "data": {
    "id": 1,
    "verificationCode": "RNT-A3B7-K9M2",
    "status": "DRAFT",
    "chatTitle": "My Monitoring Chat",
    "verificationExpiresAt": "2025-12-17T18:38:12.989Z",
    "platform": {
      "platformKey": "bale-main",
      "platformName": "bale"
    }
  }
}
```

### Step 2: User Sends Verification Code

**User action in Bale/Telegram:**
1. Open the chat/group where bot is present
2. Send message: `RNT-A3B7-K9M2`
3. Wait 2-3 seconds

**What happens:**
- Bale/Telegram webhook → Python worker → RabbitMQ → Spring Boot
- System detects code pattern, captures chat ID
- Status changes: `DRAFT` → `PENDING`

### Step 3: Verify Code Was Matched

```http
GET /api/platform-authorizations/1
Authorization: Bearer {token}
```

**Response (after code matched):**
```json
{
  "data": {
    "id": 1,
    "status": "PENDING",
    "chatId": "5176376467",
    "verificationMatchedAt": "2025-12-16T19:41:23Z",
    "verificationMatchedBy": "alishahidibale"
  }
}
```

### Step 4: Approve Authorization

```http
POST /api/platform-authorizations/1/approve
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "status": "APPROVED",
    "chatId": "5176376467",
    "ownedChannelId": 5
  }
}
```

### Additional Endpoints

```http
# List all authorizations
GET /api/platform-authorizations?status=PENDING

# Reject authorization
POST /api/platform-authorizations/{id}/reject?reason=spam

# Delete authorization
DELETE /api/platform-authorizations/{id}
```

---

## Notification Channels

Notification Channels are **destinations for alerts**. Users create them once, rules reference them.

### Channel Types

| Type | Status | Required Fields |
|------|--------|----------------|
| `MESSAGING_PLATFORM` | ✅ Implemented | `platformAuthorizationId` (approved with NTF- code) |
| `EMAIL` | ⚠️ Placeholder | `emailAddress` |
| `SMS` | ⚠️ Placeholder | `phoneNumber` |
| `WEBHOOK` | ⚠️ Placeholder | `webhookUrl`, `webhookMethod` |
| `IN_APP` | ⚠️ Placeholder | None |

### Create Notification Channel

**Prerequisites:** Have an APPROVED platform authorization with `authorizationType: NOTIFICATION_CHANNEL`

```http
POST /api/notification-channels
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Team Security Alerts",
  "description": "Critical security notifications for the team",
  "channelType": "MESSAGING_PLATFORM",
  "platformAuthorizationId": 2,
  "enabled": true,
  "priority": 1,
  "retryOnFailure": true,
  "maxRetries": 3,
  "rateLimitPerMinute": 10,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}
```

**Response:**
```json
{
  "type": "data",
  "status": 200,
  "data": {
    "id": 1,
    "name": "Team Security Alerts",
    "channelType": "MESSAGING_PLATFORM",
    "enabled": true,
    "platformAuthorizationId": 2,
    "platformName": "bale",
    "chatId": "5176376467",
    "chatTitle": "notification_channel",
    "totalMessagesSent": 0,
    "totalFailures": 0,
    "createdAt": "2025-12-16T22:15:00"
  }
}
```

### List Notification Channels

```http
# All channels (paginated)
GET /api/notification-channels?page=0&size=20

# Enabled channels only
GET /api/notification-channels/enabled

# Get specific channel
GET /api/notification-channels/1

# Get available types
GET /api/notification-channels/types
```

### Update Notification Channel

```http
PUT /api/notification-channels/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "enabled": false,
  "priority": 2
}
```

### Test Notification Channel

```http
POST /api/notification-channels/1/test?message=Test notification
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "Message sent to bale-main"
  }
}
```

### Delete Notification Channel

```http
DELETE /api/notification-channels/1
Authorization: Bearer {token}
```

---

## Dynamic Rules

Rules define **when** (conditions) and **what** (actions) should happen.

### Rule Structure

```typescript
interface Rule {
  name: string;
  category: string;  // ALERT, AUTOMATION, MONITORING, REPORT, etc.
  enabled: boolean;
  priority: number;  // Lower = higher priority
  definition: {
    name: string;
    description: string;

    // WHEN: Condition that triggers the rule
    condition: RuleCondition;

    // WHAT: Actions to execute when condition is true
    actions: RuleAction[];

    // HOW OFTEN: Schedule configuration
    schedule: RuleSchedule;

    // LIMITS: Prevent spam
    cooldownMinutes: number;
    maxTriggersPerDay: number;
    maxTriggersTotal: number;
  }
}
```

### Get Rule Schema (for UI builders)

```http
# Get available metrics
GET /api/rules/schema/metrics

# Get available operators
GET /api/rules/schema/operators

# Get available actions
GET /api/rules/schema/actions

# Get complete schema
GET /api/rules/schema
```

**Metrics Response Example:**
```json
[
  {
    "name": "KEYWORD_MATCH_COUNT",
    "code": "keyword.matchCount",
    "label": "Keyword Match Count",
    "description": "Total matches for keyword in period",
    "dataType": "number",
    "category": "keyword",
    "requiresKeyword": true,
    "requiresChannel": true,
    "requiresTimeWindow": true
  }
]
```

### Create Rule

```http
POST /api/rules
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Keyword Spike Alert",
  "category": "ALERT",
  "enabled": true,
  "priority": 100,
  "definition": {
    "name": "Keyword Spike Alert",
    "description": "Alert when keyword appears frequently",

    "condition": {
      "type": "SIMPLE",
      "metric": "KEYWORD_MATCH_COUNT",
      "operator": "GREATER_THAN",
      "value": 10,
      "targetId": 201,
      "timeWindowMinutes": 60,
      "parameters": {
        "channelId": 5
      }
    },

    "actions": [{
      "type": "SEND_TO_NOTIFICATION_CHANNEL",
      "targetNotificationChannelId": 1,
      "messageTemplate": "⚠️ ALERT: Keyword \"{{keywordText}}\" detected {{metricValue}} times (threshold: {{expectedValue}})",
      "severity": "CRITICAL",
      "enabled": true,
      "order": 0
    }],

    "schedule": {
      "type": "EVENT",
      "triggerEvents": ["KEYWORD_MATCH"],
      "timezone": "Asia/Tehran"
    },

    "cooldownMinutes": 5,
    "maxTriggersPerDay": 0,
    "maxTriggersTotal": 0
  }
}
```

### Schedule Types

| Type | Trigger | Configuration |
|------|---------|--------------|
| **REALTIME** | Every 60 seconds | No config needed |
| **INTERVAL** | Every X minutes | `intervalMinutes: 60` |
| **CRON** | Cron expression | `cronExpression: "0 0 * * *"` |
| **EVENT** | On specific event | `triggerEvents: ["KEYWORD_MATCH"]` |
| **MANUAL** | API call only | No auto-execution |

**Schedule Examples:**

```json
// Run every 30 minutes
{
  "type": "INTERVAL",
  "intervalMinutes": 30,
  "activeHours": "09:00-17:00",
  "activeDays": ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY"],
  "timezone": "Asia/Tehran"
}

// Run at midnight daily
{
  "type": "CRON",
  "cronExpression": "0 0 0 * * ?",
  "timezone": "Asia/Tehran"
}

// Trigger when keyword match happens
{
  "type": "EVENT",
  "triggerEvents": ["KEYWORD_MATCH"]
}
```

### Condition Types

**Simple Condition:**
```json
{
  "type": "SIMPLE",
  "metric": "KEYWORD_MATCH_COUNT",
  "operator": "GREATER_THAN",
  "value": 10,
  "targetId": 201,
  "timeWindowMinutes": 60,
  "parameters": { "channelId": 5 }
}
```

**Complex Condition (AND/OR):**
```json
{
  "type": "AND",
  "conditions": [
    {
      "type": "SIMPLE",
      "metric": "KEYWORD_MATCH_COUNT",
      "operator": "GREATER_THAN",
      "value": 10,
      "targetId": 201,
      "timeWindowMinutes": 60,
      "parameters": { "channelId": 5 }
    },
    {
      "type": "SIMPLE",
      "metric": "TIME_IS_BUSINESS_HOURS",
      "operator": "IS_TRUE"
    }
  ]
}
```

### Action Types

| Action Type | Required Fields | Description |
|-------------|----------------|-------------|
| `SEND_TO_NOTIFICATION_CHANNEL` | `targetNotificationChannelId`, `messageTemplate` | Send via notification channel (auto-routes to platform) |
| `NOTIFY_IN_APP` | `messageTemplate`, `severity` | Show in dashboard |
| `SEND_PLATFORM_MESSAGE` | `target` (chatId), `platformKey`, `messageTemplate` | Direct platform send (deprecated - use notification channels) |
| `SEND_PLATFORM_DOCUMENT` | `target`, `platformKey`, `documentPath` | Send file |
| `ARCHIVE_MATCHES` | `parameters.days` | Archive keyword matches |
| `ARCHIVE_STATISTICS` | `parameters.days` | Archive statistics |
| `DISABLE_KEYWORD` | `targetKeywordId` | Auto-disable keyword |
| `ENABLE_KEYWORD` | `targetKeywordId` | Auto-enable keyword |
| `TRIGGER_RULE` | `targetRuleId` | Chain to another rule |
| `LOG_EXECUTION` | None | Log to system |

### Message Template Variables

Available in `messageTemplate` field:

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `{{metricValue}}` | `64` | Actual metric value |
| `{{expectedValue}}` | `12` | Threshold from condition |
| `{{metric}}` | `KEYWORD_MATCH_COUNT` | Metric code |
| `{{metricLabel}}` | `Keyword Match Count` | Human-readable metric name |
| `{{keywordText}}` | `حامد کولیوند` | Keyword being monitored |
| `{{keywordId}}` | `201` | Keyword ID |
| `{{channelId}}` | `5` | Channel ID |
| `{{ruleId}}` | `52` | Rule ID |
| `{{ruleName}}` | `Keyword Alert` | Rule name |
| `{{messageText}}` | Full message content | (EVENT context only) |
| `{{senderUsername}}` | `@username` | (EVENT context only) |

**Example Templates:**
```
⚠️ ALERT: Keyword "{{keywordText}}" detected {{metricValue}} times (threshold: {{expectedValue}})

📊 REPORT: {{metricValue}} keyword matches in last hour
Rule: {{ruleName}}

🔴 SPIKE: {{keywordText}} mentioned {{metricValue}} times!
```

### Rule Endpoints

```http
# Create rule
POST /api/rules

# List all rules
GET /api/rules?page=0&size=20

# Get rule by ID
GET /api/rules/{id}

# Update rule
PUT /api/rules/{id}

# Delete rule
DELETE /api/rules/{id}

# Get rules by category
GET /api/rules/category/ALERT?page=0&size=20

# Toggle enabled/disabled
POST /api/rules/{id}/toggle

# Reset cooldown (allows immediate re-execution)
POST /api/rules/{id}/reset-cooldown

# Execute rule manually (respects cooldown)
POST /api/rules/{id}/execute
Body: { "channelId": 5, "keywordId": 201 }

# Test rule (no cooldown, no actions executed)
POST /api/rules/{id}/test
Body: { "channelId": 5, "keywordId": 201 }

# Get execution logs
GET /api/rules/{id}/logs?page=0&size=20

# Get all execution logs
GET /api/rules/executions?page=0&size=20

# Get rule statistics
GET /api/rules/statistics
```

### Execution Result

```json
{
  "ruleId": 52,
  "ruleName": "Keyword Alert",
  "status": "SUCCESS",
  "conditionResult": true,
  "message": "All actions executed successfully",
  "actionsExecuted": 1,
  "actionsSucceeded": 1,
  "durationMs": 145,
  "evaluationTrace": {
    "result": true,
    "trace": "64 > 12 = true",
    "metricValue": 64,
    "expectedValue": 12,
    "operator": ">"
  },
  "actionResults": [{
    "success": true,
    "message": "Notification sent via channel",
    "data": {
      "channelId": 1,
      "message": "⚠️ ALERT: Keyword \"تست\" detected 64 times (threshold: 12)"
    }
  }]
}
```

### Execution Status Values

| Status | Meaning |
|--------|---------|
| `SUCCESS` | Condition true, all actions succeeded |
| `PARTIAL` | Condition true, some actions failed |
| `CONDITION_FALSE` | Condition evaluated to false |
| `SKIPPED` | Rule in cooldown or limit reached |
| `ERROR` | Evaluation or action execution error |

---

## Keywords & Monitoring

### Create Keyword

```http
POST /api/keyword
Authorization: Bearer {token}
Content-Type: application/json

{
  "keywordText": "تست",
  "ownedChannelId": 5,
  "active": true
}
```

### List Keywords

```http
# All keywords
GET /api/keyword?page=0&size=20

# Keywords for specific channel
GET /api/keyword/owned-channel/5

# Search keywords
GET /api/keyword/search?q=تست
```

### Keyword Matches

```http
# Recent matches for channel
GET /api/keywordmatch/details/channel/5/recent?limit=10

# Matches with pagination
GET /api/keywordmatch/details/channel/5?page=0&size=20

# Matches for specific keyword
GET /api/keywordmatch/keyword/201?page=0&size=20
```

---

## Complete Integration Example

### Scenario: Setup Keyword Alert System

**1. Setup Monitoring (Receive Messages)**

```javascript
// Create monitoring authorization
const authResponse = await fetch('/api/platform-authorizations/draft', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    platformKey: 'bale-main',
    chatTitle: 'Security Monitoring',
    authorizationType: 'MONITORING_CHANNEL'
  })
});

const { data } = await authResponse.json();
console.log('Send this code to Bale:', data.verificationCode); // RNT-XXXX-XXXX

// Wait for user to send code in Bale...

// Poll for verification
const checkAuth = setInterval(async () => {
  const check = await fetch(`/api/platform-authorizations/${data.id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await check.json();

  if (result.data.verificationMatchedAt) {
    clearInterval(checkAuth);
    console.log('Code verified! Chat ID:', result.data.chatId);

    // Approve
    await fetch(`/api/platform-authorizations/${data.id}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}, 3000);
```

**2. Create Keyword**

```javascript
const keywordResponse = await fetch('/api/keyword', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    keywordText: 'حامد کولیوند',
    ownedChannelId: 5, // From approved authorization
    active: true
  })
});

const keyword = await keywordResponse.json();
console.log('Keyword created:', keyword.data.id); // 201
```

**3. Setup Notification Channel (Send Alerts)**

```javascript
// Create notification authorization (separate from monitoring)
const notifAuthResponse = await fetch('/api/platform-authorizations/draft', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    platformKey: 'bale-main',
    chatTitle: 'Alert Notifications',
    authorizationType: 'NOTIFICATION_CHANNEL'
  })
});

const notifAuth = await notifAuthResponse.json();
console.log('Send this code to Bale:', notifAuth.data.verificationCode); // NTF-YYYY-ZZZZ

// After code verified and approved, create notification channel
const channelResponse = await fetch('/api/notification-channels', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Security Alerts',
    channelType: 'MESSAGING_PLATFORM',
    platformAuthorizationId: notifAuth.data.id,
    enabled: true,
    priority: 1
  })
});

const channel = await channelResponse.json();
console.log('Notification channel created:', channel.data.id); // 1
```

**4. Create Alert Rule**

```javascript
const ruleResponse = await fetch('/api/rules', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Keyword Spike Alert',
    category: 'ALERT',
    enabled: true,
    priority: 100,
    definition: {
      name: 'Keyword Spike Alert',
      description: 'Alert on keyword spike',

      condition: {
        type: 'SIMPLE',
        metric: 'KEYWORD_MATCH_COUNT',
        operator: 'GREATER_THAN',
        value: 10,
        targetId: 201,  // Keyword ID
        timeWindowMinutes: 60,
        parameters: { channelId: 5 }
      },

      actions: [{
        type: 'SEND_TO_NOTIFICATION_CHANNEL',
        targetNotificationChannelId: 1,  // Notification channel ID
        messageTemplate: '⚠️ ALERT: Keyword "{{keywordText}}" detected {{metricValue}} times in last hour!',
        severity: 'CRITICAL',
        enabled: true,
        order: 0
      }],

      schedule: {
        type: 'EVENT',
        triggerEvents: ['KEYWORD_MATCH']
      },

      cooldownMinutes: 15,
      maxTriggersPerDay: 50
    }
  })
});

const rule = await ruleResponse.json();
console.log('Rule created:', rule.data.id);
```

**5. Test the Rule**

```javascript
// Reset cooldown if needed
await fetch(`/api/rules/${rule.data.id}/reset-cooldown`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Execute rule
const testResponse = await fetch(`/api/rules/${rule.data.id}/execute`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channelId: 5,
    keywordId: 201
  })
});

const testResult = await testResponse.json();
console.log('Execution result:', testResult);
// Check Bale notification chat for alert message
```

---

## WebSocket Real-time Updates

### Connect to WebSocket

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
  console.log('Connected to WebSocket');

  // Subscribe to keyword match notifications
  stompClient.subscribe('/topic/keyword-matches', (message) => {
    const match = JSON.parse(message.body);
    console.log('New keyword match:', match);
    // Update UI in real-time
  });

  // Subscribe to rule executions
  stompClient.subscribe('/topic/rule-executions', (message) => {
    const execution = JSON.parse(message.body);
    console.log('Rule executed:', execution);
  });
});
```

---

## Error Handling

All API responses follow this structure:

**Success:**
```json
{
  "type": "data",
  "status": 200,
  "data": { ... },
  "meta": null,
  "timestamp": "2025-12-16T22:15:00"
}
```

**Error:**
```json
{
  "type": "error",
  "status": 400,
  "data": "Invalid request: Missing required field",
  "meta": null,
  "timestamp": "2025-12-16T22:15:00"
}
```

**Paginated Response:**
```json
{
  "type": "data",
  "status": 200,
  "data": [ ... ],
  "meta": {
    "currentPage": 0,
    "totalItems": 145,
    "totalPages": 8,
    "pageSize": 20,
    "isLastPage": false
  }
}
```

---

## Rate Limits & Best Practices

### API Rate Limits
- No global rate limit currently implemented
- Notification channels can have individual rate limits (`rateLimitPerMinute`)

### Best Practices

1. **Always check `verificationMatchedAt`** before approving authorizations
2. **Use EVENT schedule** for real-time alerts (triggers on keyword match)
3. **Use INTERVAL schedule** for periodic reports
4. **Set appropriate cooldowns** to prevent spam (5-15 minutes recommended)
5. **Test rules** with `/test` endpoint before enabling
6. **Reset cooldown** with `/reset-cooldown` for manual testing
7. **Use notification channels** instead of direct platform messages (better abstraction)

### Common Patterns

**Pattern 1: Real-time Alert**
```json
{
  "schedule": { "type": "EVENT", "triggerEvents": ["KEYWORD_MATCH"] },
  "cooldownMinutes": 10
}
```

**Pattern 2: Hourly Report**
```json
{
  "schedule": { "type": "INTERVAL", "intervalMinutes": 60 },
  "cooldownMinutes": 0
}
```

**Pattern 3: Daily Summary at 9 AM**
```json
{
  "schedule": {
    "type": "CRON",
    "cronExpression": "0 0 9 * * ?",
    "timezone": "Asia/Tehran"
  }
}
```

---

## Troubleshooting

### Rule Returns "SKIPPED"
- **Cause:** Cooldown active or limits reached
- **Fix:** Call `/api/rules/{id}/reset-cooldown`

### Template Variables Not Replaced
- **Cause:** Variable not in context
- **Fix:** Check available variables table above
- **Note:** `keywordText`, `metricValue`, etc. are auto-populated

### Notification Not Delivered
- **Check:** Notification channel status: `/api/notification-channels/1`
- **Check:** Platform authorization status must be `APPROVED`
- **Check:** `totalFailures` and `lastError` fields
- **Test:** Use `/api/notification-channels/1/test` endpoint

### Timezone Issues (metrics return 0)
- **Fixed:** All timezone comparisons now use UTC `Instant`
- **Metrics:** Use `timeWindowMinutes` to specify period
- **Note:** System handles Tehran (+3:30) ↔ UTC conversion

---

## Frontend UI Integration

### Existing Test UI
Located at: `http://localhost:3000/pages/rules`

**Features:**
- Visual rule builder
- Metric/operator/value selection
- Action configuration
- Schedule setup
- Severity buttons
- Notification channel selection

### Required UI Components

**1. Platform Authorization Flow**
```
┌─────────────────────────────────┐
│  Create Authorization           │
│  ├─ Select Type (Monitoring/    │
│  │  Notification)                │
│  ├─ Platform: Bale               │
│  └─ Generate Code                │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Show Verification Code         │
│  "Send RNT-A3B7-K9M2 to chat"   │
│  ⏳ Waiting for verification... │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  ✅ Code Verified!              │
│  Chat ID: 5176376467            │
│  [Approve] [Reject]             │
└─────────────────────────────────┘
```

**2. Notification Channel Manager**
```
┌─────────────────────────────────────────┐
│  Notification Channels                  │
├─────────────────────────────────────────┤
│  ➕ Create Channel                      │
│                                          │
│  📱 Team Security Alerts                │
│     └─ Bale: notification_channel       │
│     └─ 📊 Sent: 45 | ❌ Failed: 0       │
│     └─ [Edit] [Test] [Delete]           │
│                                          │
│  📧 Email Alerts (Coming Soon)          │
│                                          │
└─────────────────────────────────────────┘
```

**3. Rule Builder**
```
┌──────────────────────────────────────────┐
│  Condition Builder                       │
│  ┌────────────────────────────────────┐ │
│  │ Metric: [Keyword Match Count ▼]   │ │
│  │ Operator: [>  ▼]                   │ │
│  │ Value: [10]                        │ │
│  │ Keyword ID: [201]                  │ │
│  │ Channel ID: [5]                    │ │
│  │ Time Window: [60] minutes          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Actions                                 │
│  ┌────────────────────────────────────┐ │
│  │ Type: [Send to Notification ▼]    │ │
│  │ Channel: [Team Alerts ▼] (ID: 1)  │ │
│  │ Message: [Template...]             │ │
│  │ Severity: [ℹ️] [⚠️] [🔴]           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Schedule                                │
│  ┌────────────────────────────────────┐ │
│  │ Type: [EVENT ▼]                    │ │
│  │ Trigger: [KEYWORD_MATCH]           │ │
│  │ Cooldown: [15] minutes             │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## API Response Formats

### List Response (Paginated)
```typescript
interface PaginatedResponse<T> {
  type: 'data';
  status: 200;
  data: T[];
  meta: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
    isLastPage: boolean;
  };
  timestamp: string;
}
```

### Single Item Response
```typescript
interface DataResponse<T> {
  type: 'data';
  status: 200;
  data: T;
  meta: null;
  timestamp: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  type: 'error';
  status: number;  // 400, 404, 500, etc.
  data: string;     // Error message
  meta: null;
  timestamp: string;
}
```

---

## Testing Checklist

- [ ] Can create MONITORING_CHANNEL authorization (RNT- code)
- [ ] Can create NOTIFICATION_CHANNEL authorization (NTF- code)
- [ ] Verification codes are detected in Bale messages
- [ ] Chat IDs are captured after verification
- [ ] Can approve/reject authorizations
- [ ] Can create keywords for monitoring channels
- [ ] Messages from Bale are processed and keywords detected
- [ ] Can create notification channels linked to approved authorizations
- [ ] Can create rules with notification channel actions
- [ ] Template variables are replaced correctly
- [ ] EVENT rules trigger on keyword matches
- [ ] INTERVAL rules execute on schedule
- [ ] REALTIME rules execute every 60 seconds
- [ ] Cooldown prevents spam execution
- [ ] Can reset cooldown for testing
- [ ] Execution logs are recorded
- [ ] Notifications are delivered to correct Bale chat

---

## Support & Contact

For issues, check:
1. Backend logs: `/tmp/spring-boot.log`
2. Bale worker logs: Check Python worker output
3. Database: PostgreSQL for entities, ScyllaDB for time-series data
4. RabbitMQ: Check message flow between Python and Spring Boot

**Architecture:**
```
Bale Platform
    ↓ webhook
Python Worker (messengers/bale/)
    ↓ RabbitMQ
Spring Boot Backend
    ↓ PostgreSQL + ScyllaDB
    ↓ Rule Engine
Notification Channels
    ↓ Bale/Email/SMS/Webhook
```
