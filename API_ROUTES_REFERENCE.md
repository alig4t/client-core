# API Routes Reference

Complete endpoint reference organized by feature.

**Base URL:** `http://localhost:8080/api`

---

## 🔐 Authentication

```
POST   /api/auth/login              # Login and get JWT token
POST   /api/auth/logout             # Logout
POST   /api/auth/refresh            # Refresh token
```

---

## 📱 Platform Authorizations

Connect Bale/Telegram chats to the system.

```
# Create & Manage
POST   /api/platform-authorizations/draft           # Create authorization (get verification code)
GET    /api/platform-authorizations                 # List authorizations
GET    /api/platform-authorizations/{id}            # Get specific authorization
PUT    /api/platform-authorizations/{id}            # Update authorization
DELETE /api/platform-authorizations/{id}            # Delete authorization

# Verification Flow
POST   /api/platform-authorizations/{id}/verify     # Mark as pending verification
POST   /api/platform-authorizations/{id}/approve    # Approve (admin)
POST   /api/platform-authorizations/{id}/reject     # Reject (admin)

# Query
GET    /api/platform-authorizations?status=PENDING  # Filter by status
```

**Request Body (draft):**
```json
{
  "platformKey": "bale-main",
  "chatTitle": "My Chat",
  "authorizationType": "MONITORING_CHANNEL"  // or NOTIFICATION_CHANNEL
}
```

**Verification Codes:**
- `MONITORING_CHANNEL` → `RNT-XXXX-XXXX`
- `NOTIFICATION_CHANNEL` → `NTF-XXXX-XXXX`

---

## 🔔 Notification Channels

Alert destinations (Bale, Email, SMS, Webhook, In-App).

```
# CRUD Operations
POST   /api/notification-channels                   # Create channel
GET    /api/notification-channels                   # List all (paginated)
GET    /api/notification-channels/enabled           # List enabled only
GET    /api/notification-channels/{id}              # Get specific channel
PUT    /api/notification-channels/{id}              # Update channel
DELETE /api/notification-channels/{id}              # Delete channel

# Testing & Info
POST   /api/notification-channels/{id}/test         # Test send notification
GET    /api/notification-channels/types             # Get available types
```

**Request Body (create):**
```json
{
  "name": "Team Alerts",
  "description": "Security notifications",
  "channelType": "MESSAGING_PLATFORM",
  "platformAuthorizationId": 2,
  "enabled": true,
  "priority": 1,
  "rateLimitPerMinute": 10,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00",
  "retryOnFailure": true,
  "maxRetries": 3
}
```

**Channel Types:**
- `MESSAGING_PLATFORM` - Bale/Telegram (✅ implemented)
- `EMAIL` - Email notifications (⚠️ placeholder)
- `SMS` - Text messages (⚠️ placeholder)
- `WEBHOOK` - HTTP callbacks (⚠️ placeholder)
- `IN_APP` - Dashboard notifications (⚠️ placeholder)

---

## 📏 Dynamic Rules

Rule engine for automated monitoring and alerts.

```
# CRUD Operations
POST   /api/rules                                   # Create rule
GET    /api/rules                                   # List all rules (paginated)
GET    /api/rules/{id}                              # Get specific rule
PUT    /api/rules/{id}                              # Update rule
DELETE /api/rules/{id}                              # Delete rule

# Search & Filter
GET    /api/rules/category/{category}               # Get rules by category
GET    /api/rules/search?q=keyword                  # Search rules

# Control & Execution
POST   /api/rules/{id}/toggle                       # Enable/disable rule
POST   /api/rules/{id}/reset-cooldown               # Reset cooldown timer
POST   /api/rules/{id}/execute                      # Execute rule (respects cooldown)
POST   /api/rules/{id}/test                         # Test rule (no cooldown, no actions)

# Monitoring & Logs
GET    /api/rules/{id}/logs                         # Get execution logs for rule
GET    /api/rules/executions                        # Get all execution logs
GET    /api/rules/statistics                        # Get overall statistics

# Schema & Metadata (for UI builders)
GET    /api/rules/schema                            # Complete schema
GET    /api/rules/schema/metrics                    # Available metrics
GET    /api/rules/schema/operators                  # Available operators
GET    /api/rules/schema/actions                    # Available actions

# Templates
GET    /api/rules/templates                         # List rule templates
POST   /api/rules/templates/{id}/create             # Create rule from template
```

**Rule Categories:**
- `ALERT` - Security alerts, spike detection
- `AUTOMATION` - Auto-enable/disable keywords, chain rules
- `MONITORING` - Continuous monitoring
- `REPORT` - Periodic reports
- `ARCHIVE` - Data archival rules

---

## 🔍 Keywords

```
# CRUD Operations
POST   /api/keyword                                 # Create keyword
GET    /api/keyword                                 # List all keywords
GET    /api/keyword/{id}                            # Get specific keyword
PUT    /api/keyword/{id}                            # Update keyword
DELETE /api/keyword/{id}                            # Delete keyword

# Query
GET    /api/keyword/owned-channel/{id}              # Keywords for channel
GET    /api/keyword/search?q=text                   # Search keywords
```

**Request Body:**
```json
{
  "keywordText": "حامد کولیوند",
  "ownedChannelId": 5,
  "active": true
}
```

---

## 📊 Keyword Matches

```
# Query Matches
GET    /api/keywordmatch/details/channel/{channelId}/recent?limit=10
GET    /api/keywordmatch/details/channel/{channelId}?page=0&size=20
GET    /api/keywordmatch/keyword/{keywordId}?page=0&size=20
GET    /api/keywordmatch/owned-channel/{id}/paginated?page=0&size=20

# Statistics
GET    /api/keywordmatch/stats/channel/{channelId}
GET    /api/keywordmatch/stats/keyword/{keywordId}
```

**Match Response:**
```json
{
  "id": "uuid",
  "ownedChannelId": 5,
  "keywordId": 201,
  "keywordText": "test",
  "messageText": "This is a test message",
  "matchedAt": "2025-12-16T19:41:45.892Z",
  "senderUsername": "user123",
  "senderId": "250191429"
}
```

---

## 📈 Analytics

```
# Channel Analytics
GET    /api/analytics/channels/{id}/dashboard?hours=24
GET    /api/analytics/channels/{id}/top-keywords?hours=24&limit=10
GET    /api/analytics/channels/{id}/activity-heatmap?days=7

# Keyword Analytics
GET    /api/analytics/keywords/{id}/trend?days=7
GET    /api/analytics/keywords/{id}/correlations?channelId={cid}&limit=10
GET    /api/analytics/keywords/{id}/prediction?channelId={cid}&days=7

# Global Analytics
GET    /api/analytics/global/overview
GET    /api/analytics/global/top-channels?limit=10
```

---

## 🗂️ Channels (Monitoring Channels)

```
# CRUD Operations
POST   /api/channel                                 # Create channel
GET    /api/channel                                 # List channels
GET    /api/channel/{id}                            # Get channel
PUT    /api/channel/{id}                            # Update channel
DELETE /api/channel/{id}                            # Delete channel
```

---

## 🔗 Owned Channels

Represents actual Bale/Telegram chats being monitored.

```
GET    /api/owned-channel                           # List owned channels
GET    /api/owned-channel/{id}                      # Get owned channel
PUT    /api/owned-channel/{id}                      # Update owned channel
DELETE /api/owned-channel/{id}                      # Delete owned channel

# Status Management
POST   /api/owned-channel/{id}/activate             # Activate channel
POST   /api/owned-channel/{id}/deactivate           # Deactivate channel
```

---

## 📦 Archive

```
# Create Archives
POST   /api/archive/matches                         # Archive keyword matches
POST   /api/archive/statistics                      # Archive statistics
POST   /api/archive/reports                         # Archive reports

# Query Archives
GET    /api/archive/list?type=MATCHES&page=0&size=20
GET    /api/archive/{id}                            # Get archive details
DELETE /api/archive/{id}                            # Delete archive
```

---

## 🌐 Messaging Platforms

```
GET    /api/messaging-platform                      # List platforms
GET    /api/messaging-platform/{id}                 # Get platform
POST   /api/messaging-platform                      # Create platform (admin)
PUT    /api/messaging-platform/{id}                 # Update platform (admin)
```

**Platform Keys:**
- `bale-main` - Main Bale instance
- `telegram-main` - Main Telegram instance
- `eitaa-main` - Eitaa instance

---

## 🔄 Message Queue Status

For debugging integration issues:

```
# Check RabbitMQ
http://localhost:15672           # RabbitMQ Management UI
Username: guest
Password: guest

# Queues to monitor:
- platform.bale.incoming         # Messages from Bale → Spring Boot
- platform.bale.outgoing         # Commands from Spring Boot → Bale
```

---

## 🎯 Complete API Flow Map

### Setup Flow

```
1. POST /api/auth/login
2. POST /api/platform-authorizations/draft (MONITORING_CHANNEL)
3. User sends RNT- code in Bale
4. GET  /api/platform-authorizations/{id} (verify chatId captured)
5. POST /api/platform-authorizations/{id}/approve
6. POST /api/keyword (create keyword for monitoring)
7. POST /api/platform-authorizations/draft (NOTIFICATION_CHANNEL)
8. User sends NTF- code in Bale
9. POST /api/platform-authorizations/{id}/approve
10. POST /api/notification-channels (create alert destination)
11. POST /api/rules (create rule linking everything)
```

### Runtime Flow

```
1. User sends message in monitoring chat
2. Webhook → Python → RabbitMQ → Spring Boot
3. Keywords detected → stored in ScyllaDB
4. Statistics aggregated
5. EVENT rules triggered
6. Conditions evaluated
7. Actions executed
8. Notifications sent via notification channels
9. Execution logged
10. WebSocket updates sent to connected clients
```

---

## 📡 WebSocket Topics

```javascript
// Connect
const socket = new SockJS('http://localhost:8080/ws');
const stomp = Stomp.over(socket);

// Subscribe to topics
stomp.subscribe('/topic/keyword-matches', callback);
stomp.subscribe('/topic/rule-executions', callback);
stomp.subscribe('/topic/notifications', callback);
```

---

## 🧪 Testing Endpoints

```bash
# Health check
GET    /actuator/health

# Metrics
GET    /actuator/metrics

# Test notification
POST   /api/notification-channels/1/test?message=Hello

# Test rule (no side effects)
POST   /api/rules/1/test
Body: { "channelId": 5, "keywordId": 201 }
```

---

## 📋 Query Parameters

**Pagination:**
```
?page=0&size=20&sort=createdAt,desc
```

**Filtering:**
```
?status=APPROVED
?category=ALERT
?enabled=true
```

**Date Ranges:**
```
?startDate=2025-12-01T00:00:00Z
?endDate=2025-12-31T23:59:59Z
```

**Analytics:**
```
?hours=24
?days=7
?limit=10
```

---

## 🎨 Frontend State Management Suggestions

### State Structure

```typescript
interface AppState {
  auth: {
    token: string;
    user: User;
  };

  platformAuthorizations: {
    monitoring: PlatformAuthorization[];
    notification: PlatformAuthorization[];
    pending: PlatformAuthorization[];
  };

  notificationChannels: {
    items: NotificationChannel[];
    enabled: NotificationChannel[];
  };

  rules: {
    items: Rule[];
    byCategory: Record<string, Rule[]>;
    schema: RuleSchema;
  };

  keywords: {
    items: Keyword[];
    byChannel: Record<number, Keyword[]>;
  };

  realtime: {
    matches: KeywordMatch[];
    executions: RuleExecution[];
  };
}
```

### API Service Example

```typescript
class RuleEngineAPI {
  constructor(private baseURL: string, private getToken: () => string) {}

  async createMonitoringAuth(chatTitle: string) {
    return this.post('/platform-authorizations/draft', {
      platformKey: 'bale-main',
      chatTitle,
      authorizationType: 'MONITORING_CHANNEL'
    });
  }

  async createNotificationAuth(chatTitle: string) {
    return this.post('/platform-authorizations/draft', {
      platformKey: 'bale-main',
      chatTitle,
      authorizationType: 'NOTIFICATION_CHANNEL'
    });
  }

  async approveAuthorization(id: number) {
    return this.post(`/platform-authorizations/${id}/approve`);
  }

  async createNotificationChannel(data: CreateChannelDTO) {
    return this.post('/notification-channels', data);
  }

  async createRule(rule: CreateRuleDTO) {
    return this.post('/rules', rule);
  }

  async executeRule(id: number, context: Record<string, any>) {
    return this.post(`/rules/${id}/execute`, context);
  }

  async resetCooldown(id: number) {
    return this.post(`/rules/${id}/reset-cooldown`);
  }

  private async post(endpoint: string, body?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return response.json();
  }
}
```

---

## 🔄 Real-time Updates

### WebSocket Connection

```typescript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class RealtimeService {
  private stompClient: any;

  connect(token: string) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        console.log('WebSocket connected');

        // Subscribe to keyword matches
        this.stompClient.subscribe('/topic/keyword-matches', (message) => {
          const match = JSON.parse(message.body);
          this.onKeywordMatch(match);
        });

        // Subscribe to rule executions
        this.stompClient.subscribe('/topic/rule-executions', (message) => {
          const execution = JSON.parse(message.body);
          this.onRuleExecution(execution);
        });
      }
    );
  }

  onKeywordMatch(match: KeywordMatch) {
    // Update UI: show new match in real-time
    console.log('New keyword match:', match);
  }

  onRuleExecution(execution: RuleExecution) {
    // Update UI: show rule execution result
    console.log('Rule executed:', execution);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
```

---

## 🎨 UI Component Data Requirements

### Authorization Wizard

**Needs:**
```typescript
// Step 1: Create draft
POST /api/platform-authorizations/draft
→ verificationCode

// Step 2: Poll for verification (every 2-3 seconds)
GET /api/platform-authorizations/{id}
→ verificationMatchedAt, chatId

// Step 3: Approve
POST /api/platform-authorizations/{id}/approve
```

### Notification Channel Form

**Needs:**
```typescript
// Load approved notification authorizations
GET /api/platform-authorizations?status=APPROVED
Filter: authorizationType === 'NOTIFICATION_CHANNEL'

// Create channel
POST /api/notification-channels
```

### Rule Builder

**Needs:**
```typescript
// Load schema
GET /api/rules/schema
→ metrics[], operators[], actions[]

// Load notification channels (for action dropdown)
GET /api/notification-channels/enabled
→ [{ id: 1, name: 'Team Alerts' }, ...]

// Load keywords (for condition dropdown)
GET /api/keyword/owned-channel/{channelId}

// Create rule
POST /api/rules
```

### Rule Dashboard

**Needs:**
```typescript
// Load rules
GET /api/rules?page=0&size=20

// Real-time updates
WebSocket: /topic/rule-executions

// Execution history
GET /api/rules/{id}/logs?page=0&size=10

// Statistics
GET /api/rules/statistics
```

### Keyword Monitor

**Needs:**
```typescript
// Recent matches
GET /api/keywordmatch/details/channel/{id}/recent?limit=50

// Real-time updates
WebSocket: /topic/keyword-matches

// Statistics
GET /api/analytics/channels/{id}/dashboard?hours=24
```

---

## 🔑 Important Field Mappings

### Condition Fields

```typescript
interface RuleCondition {
  type: 'SIMPLE' | 'AND' | 'OR' | 'NOT';
  metric: string;                    // MetricType name
  operator: string;                  // RuleOperator name
  value: any;                        // Expected value
  targetId: number;                  // Keyword ID (NOT keywordId!)
  timeWindowMinutes: number;         // Time window for metrics
  parameters: {
    channelId: number;               // Channel ID (in parameters!)
  };
}
```

**Common Mistake:**
❌ `keywordId: 201`
✅ `targetId: 201`

❌ `channelId: 5` (at root level)
✅ `parameters: { channelId: 5 }`

### Action Fields

```typescript
interface RuleAction {
  type: string;                      // ActionType name
  messageTemplate: string;           // Template with {{variables}}
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  enabled: boolean;
  order: number;

  // Target fields (use ONE based on action type)
  target: string;                    // For SEND_PLATFORM_MESSAGE (chatId)
  targetKeywordId: number;           // For DISABLE_KEYWORD, ENABLE_KEYWORD
  targetRuleId: number;              // For TRIGGER_RULE, DISABLE_RULE
  targetNotificationChannelId: number; // For SEND_TO_NOTIFICATION_CHANNEL

  parameters: Record<string, any>;   // Additional params
}
```

---

## 🚨 Error Codes

| Status | Type | Meaning |
|--------|------|---------|
| 200 | `data` | Success |
| 400 | `error` | Bad request (validation failed) |
| 401 | `error` | Unauthorized (invalid/missing token) |
| 403 | `error` | Forbidden (no permission) |
| 404 | `error` | Not found |
| 409 | `error` | Conflict (duplicate) |
| 500 | `error` | Server error |

---

## 🧪 Postman Collection

Save as `RNT_Social_API.postman_collection.json`:

```json
{
  "info": {
    "name": "RNT Social API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{
      "key": "token",
      "value": "{{token}}",
      "type": "string"
    }]
  },
  "variable": [{
    "key": "baseUrl",
    "value": "http://localhost:8080/api"
  }],
  "item": [
    {
      "name": "Auth",
      "item": [{
        "name": "Login",
        "request": {
          "method": "POST",
          "url": "{{baseUrl}}/auth/login",
          "body": {
            "mode": "raw",
            "raw": "{\"username\":\"admin\",\"password\":\"Admin@12345\"}"
          }
        }
      }]
    },
    {
      "name": "Platform Authorizations",
      "item": [
        {
          "name": "Create Monitoring Auth",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/platform-authorizations/draft",
            "body": {
              "mode": "raw",
              "raw": "{\"platformKey\":\"bale-main\",\"chatTitle\":\"monitoring\",\"authorizationType\":\"MONITORING_CHANNEL\"}"
            }
          }
        },
        {
          "name": "Approve Authorization",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/platform-authorizations/1/approve"
          }
        }
      ]
    }
  ]
}
```

---

## 📖 Additional Documentation

- **Complete API Docs:** `API_DOCUMENTATION.md`
- **Quick Start:** `FRONTEND_QUICK_START.md`
- **Backend Repo:** `/home/ali/Projects/RNT_Social_Api/`
- **Test UI:** `http://localhost:3000/pages/rules`

---

**Last Updated:** December 2025
