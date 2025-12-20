# Frontend Quick Start Guide

Fast setup guide for integrating with RNT Social API Rule Engine.

---

## 🚀 Quick Setup (5 Minutes)

### 1. Start Backend Services

```bash
# In project root
docker-compose up -d  # Start PostgreSQL, ScyllaDB, RabbitMQ, Redis

# Start Bale worker (Python)
cd messengers/bale
./dev-run.sh worker &

# Start Bale API (Python)
./dev-run.sh api &

# Start Spring Boot backend
cd ../../
mvn spring-boot:run
```

**Backend ready at:** `http://localhost:8080`

### 2. Get Auth Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@12345"}' \
  | jq -r '.data.token'
```

Save this token for all requests.

### 3. Test API

```bash
# Get rule schema
curl http://localhost:8080/api/rules/schema \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .
```

---

## 📱 Complete Flow (10 Minutes)

### Step-by-Step Test

**1. Create Monitoring Channel** (receives messages)

```bash
TOKEN="your_token_here"

# Create draft
curl -X POST http://localhost:8080/api/platform-authorizations/draft \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platformKey": "bale-main",
    "chatTitle": "monitoring",
    "authorizationType": "MONITORING_CHANNEL"
  }' | jq .

# Returns: { "verificationCode": "RNT-ABCD-1234" }
```

**2. Send Code in Bale**
- Open Bale app
- Send message: `RNT-ABCD-1234`
- Wait 3 seconds

**3. Approve**
```bash
# Check if code matched (chatId should be set)
curl http://localhost:8080/api/platform-authorizations/1 \
  -H "Authorization: Bearer $TOKEN" | jq .

# Approve it
curl -X POST http://localhost:8080/api/platform-authorizations/1/approve \
  -H "Authorization: Bearer $TOKEN"
```

**4. Create Keyword**
```bash
# Get ownedChannelId from authorization (e.g., 5)
curl -X POST http://localhost:8080/api/keyword \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "keywordText": "test",
    "ownedChannelId": 5,
    "active": true
  }'
```

**5. Create Notification Channel** (sends alerts)

```bash
# Create notification authorization
curl -X POST http://localhost:8080/api/platform-authorizations/draft \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platformKey": "bale-main",
    "chatTitle": "alerts",
    "authorizationType": "NOTIFICATION_CHANNEL"
  }' | jq .

# Returns: { "verificationCode": "NTF-XYZ9-5678" }

# Send NTF-XYZ9-5678 in Bale (can be different chat)

# Approve
curl -X POST http://localhost:8080/api/platform-authorizations/2/approve \
  -H "Authorization: Bearer $TOKEN"

# Create notification channel
curl -X POST http://localhost:8080/api/notification-channels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Alerts",
    "channelType": "MESSAGING_PLATFORM",
    "platformAuthorizationId": 2,
    "enabled": true
  }'
```

**6. Create Rule**
```bash
curl -X POST http://localhost:8080/api/rules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Alert",
    "category": "ALERT",
    "definition": {
      "condition": {
        "type": "SIMPLE",
        "metric": "KEYWORD_MATCH_COUNT",
        "operator": "GREATER_THAN",
        "value": 3,
        "targetId": 201,
        "timeWindowMinutes": 10,
        "parameters": { "channelId": 5 }
      },
      "actions": [{
        "type": "SEND_TO_NOTIFICATION_CHANNEL",
        "targetNotificationChannelId": 1,
        "messageTemplate": "Alert: {{metricValue}} matches!",
        "severity": "CRITICAL"
      }],
      "schedule": {
        "type": "EVENT",
        "triggerEvents": ["KEYWORD_MATCH"]
      },
      "cooldownMinutes": 5
    }
  }'
```

**7. Test**
- Send 5 messages containing "test" in monitoring chat
- Check alert chat for notification

---

## 🎯 Key API Endpoints

### Must-Have Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Get auth token |
| `/api/platform-authorizations/draft` | POST | Start channel verification |
| `/api/platform-authorizations/{id}` | GET | Check verification status |
| `/api/platform-authorizations/{id}/approve` | POST | Approve channel |
| `/api/notification-channels` | POST | Create notification channel |
| `/api/notification-channels` | GET | List channels |
| `/api/rules` | POST | Create rule |
| `/api/rules` | GET | List rules |
| `/api/rules/{id}/execute` | POST | Execute rule manually |
| `/api/rules/{id}/reset-cooldown` | POST | Reset for testing |
| `/api/rules/schema` | GET | Get schema for UI builder |
| `/api/keyword` | POST | Create keyword |
| `/api/keywordmatch/details/channel/{id}/recent` | GET | Get recent matches |

---

## 🏗️ Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER SETUP PHASE                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Create MONITORING authorization → RNT-XXXX-XXXX         │
│  2. Send code to Bale monitoring chat                        │
│  3. Approve → chatId captured                                │
│  4. Create keywords for monitoring                           │
│                                                               │
│  5. Create NOTIFICATION authorization → NTF-YYYY-ZZZZ       │
│  6. Send code to Bale alert chat                            │
│  7. Approve → chatId captured                                │
│  8. Create notification channel                              │
│                                                               │
│  9. Create rule linking everything together                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME EXECUTION                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User sends message in monitoring chat                       │
│         ↓                                                     │
│  Bale Webhook → Python Worker                               │
│         ↓                                                     │
│  RabbitMQ (platform.bale.incoming)                          │
│         ↓                                                     │
│  Spring Boot MessengerInboundListener                        │
│         ↓                                                     │
│  KeywordDetectionService                                     │
│         ↓                                                     │
│  ScyllaDB: keyword_matches_by_channel                       │
│         ↓                                                     │
│  StatisticsAggregationService                               │
│         ↓                                                     │
│  ScyllaDB: keyword_stats_by_channel                         │
│         ↓                                                     │
│  RuleSchedulerService.triggerEventRules("KEYWORD_MATCH")   │
│         ↓                                                     │
│  RuleEngineService.evaluateRulesForEvent()                  │
│         ↓                                                     │
│  MetricsService: Get KEYWORD_MATCH_COUNT from ScyllaDB      │
│         ↓                                                     │
│  ConditionEvaluator: Compare metricValue > threshold        │
│         ↓ (if true)                                          │
│  ActionService.executeActions()                             │
│         ↓                                                     │
│  NotificationActionExecutor                                  │
│         ↓                                                     │
│  NotificationChannelService.sendNotification()              │
│         ↓                                                     │
│  MessengerCommandPublisher                                   │
│         ↓                                                     │
│  RabbitMQ (platform.bale.outgoing)                          │
│         ↓                                                     │
│  Python Worker sends to Bale                                 │
│         ↓                                                     │
│  User receives alert in notification chat                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### PostgreSQL Tables

**Core Entities:**
- `platform_authorizations` - Chat verifications (RNT-/NTF- codes)
- `owned_channels` - Monitored chats
- `notification_channels` - Alert destinations
- `keywords` - Keywords to monitor
- `dynamic_rules` - Rule definitions
- `rule_execution_logs` - Execution history

**Relationships:**
```
User
 ├── PlatformAuthorization (type: MONITORING_CHANNEL)
 │    └── OwnedChannel
 │         └── Keywords
 │
 ├── PlatformAuthorization (type: NOTIFICATION_CHANNEL)
 │    └── NotificationChannel
 │
 └── DynamicRule
      ├── Condition (references Keywords via targetId)
      └── Actions (references NotificationChannel via targetNotificationChannelId)
```

### ScyllaDB Tables (Time-Series)

- `keyword_matches_by_channel` - Raw keyword matches
- `keyword_stats_by_channel` - Aggregated statistics (hourly/daily)
- `hourly_activity_by_channel` - Activity heatmap data

---

## 🔧 Configuration

### Environment Variables

**Spring Boot** (`application.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/rnt_social
spring.cassandra.contact-points=localhost:9042
spring.rabbitmq.host=localhost
```

**Python Workers** (`.env`):
```env
PLATFORM_ID=bale-main
RABBIT_URL=amqp://guest:guest@localhost:5672/
BALE_TOKEN=your_bale_bot_token
WEBHOOK_URL=https://your-domain.com/webhook/bale/secret-token
```

---

## 🐛 Common Issues

### Issue: Rule Returns 0 Matches

**Cause:** Timezone mismatch (FIXED)
**Solution:** Already fixed - uses `Instant` for all time comparisons

### Issue: Template Variables Not Replaced

**Cause:** Variable not in context (FIXED)
**Solution:** `metricValue`, `keywordText`, etc. now auto-populated

### Issue: Rule Skipped (Cooldown)

**Cause:** Rule executed recently
**Solution:**
```bash
curl -X POST http://localhost:8080/api/rules/1/reset-cooldown \
  -H "Authorization: Bearer $TOKEN"
```

### Issue: Notification Not Sent

**Check:**
1. Notification channel status: `GET /api/notification-channels/1`
2. Platform authorization must be `APPROVED`
3. Check `lastError` field in response

**Test:**
```bash
curl -X POST http://localhost:8080/api/notification-channels/1/test?message=Hello \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Changelog (Recent Updates)

### December 2025

**✅ Rule Scheduler System**
- INTERVAL rules execute automatically every X minutes
- CRON rules support cron expressions
- EVENT rules trigger on KEYWORD_MATCH events
- REALTIME rules run every 60 seconds
- `@EnableScheduling` added to application

**✅ Notification Channel System**
- Separate authorization flow with NTF- prefix
- Auto-routing based on channel type
- Links to PlatformAuthorization for messaging platforms
- Statistics tracking (sent/failed counts)

**✅ Timezone Fixes**
- All time comparisons use UTC `Instant`
- Fixes Tehran timezone mismatch issues
- Metrics now return correct values

**✅ Template Variables**
- `metricValue`, `expectedValue` added to action context
- `keywordText` fetched automatically from keyword entity
- Full variable substitution in message templates

**✅ API Endpoints**
- `POST /api/rules/{id}/reset-cooldown` - Reset for testing
- `POST /api/notification-channels` - Create notification destination
- `GET /api/notification-channels/enabled` - List active channels
- `POST /api/notification-channels/{id}/test` - Test sending

---

## 📚 Additional Resources

- Full API Documentation: `API_DOCUMENTATION.md`
- Example UI: `http://localhost:3000/pages/rules`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Test Frontend: `/home/ali/Projects/RNT_Social_Api/test-frontend/`

---

## 💡 Tips for Frontend Developers

1. **Use the schema endpoints** to dynamically build UI:
   ```javascript
   const schema = await fetch('/api/rules/schema').then(r => r.json());
   // Build dropdowns from schema.metrics, schema.operators, schema.actions
   ```

2. **Poll for verification**:
   ```javascript
   const pollInterval = setInterval(async () => {
     const auth = await fetch(`/api/platform-authorizations/${id}`);
     if (auth.data.verificationMatchedAt) {
       clearInterval(pollInterval);
       // Show approve button
     }
   }, 2000);
   ```

3. **Load notification channels** for action builder:
   ```javascript
   const channels = await fetch('/api/notification-channels/enabled')
     .then(r => r.json());
   // Show dropdown: channels.data.map(c => ({ id: c.id, label: c.name }))
   ```

4. **Validate before save**:
   - MESSAGING_PLATFORM channels need approved authorization
   - Rules with KEYWORD metrics need `targetId` and `timeWindowMinutes`
   - INTERVAL schedule needs `intervalMinutes`
   - CRON schedule needs `cronExpression`

5. **Test rules** before enabling:
   ```javascript
   // Use /test endpoint (doesn't respect cooldown, doesn't execute actions)
   const test = await fetch(`/api/rules/${id}/test`, {
     method: 'POST',
     body: JSON.stringify({ channelId: 5, keywordId: 201 })
   });
   ```

---

## 🎨 UI Component Suggestions

### Authorization Flow Component

```jsx
<AuthorizationWizard>
  <Step1_SelectType />           {/* MONITORING or NOTIFICATION */}
  <Step2_ShowCode />              {/* Display RNT-/NTF- code */}
  <Step3_WaitForVerification />   {/* Poll until matched */}
  <Step4_ApproveReject />         {/* Admin approval */}
</AuthorizationWizard>
```

### Notification Channel Manager

```jsx
<NotificationChannelList>
  <CreateChannelButton />
  <ChannelCard
    name="Team Alerts"
    type="MESSAGING_PLATFORM"
    platform="Bale"
    chatId="5176376467"
    stats={{ sent: 45, failed: 0 }}
    actions={<><EditButton /><TestButton /><DeleteButton /></>}
  />
</NotificationChannelList>
```

### Rule Builder

```jsx
<RuleBuilder schema={schema}>
  <ConditionBuilder
    metrics={schema.metrics}
    operators={schema.operators}
    onMetricChange={showRequiredFields}
  />
  <ActionBuilder
    actions={schema.actions}
    notificationChannels={channels}
  />
  <ScheduleSelector
    types={['REALTIME', 'INTERVAL', 'CRON', 'EVENT', 'MANUAL']}
  />
</RuleBuilder>
```

---

## 🔐 Security Notes

- All endpoints require JWT token
- Users can only access their own resources
- Platform authorizations are user-scoped
- Notification channels are user-scoped
- Rules are user-scoped

---

## 📞 Support

For questions or issues:
1. Check logs: `/tmp/spring-boot.log`
2. Verify services are running: `docker ps`
3. Check RabbitMQ: `http://localhost:15672` (guest/guest)
4. Check database connections

**Backend Team Contact:** [Your contact info]
