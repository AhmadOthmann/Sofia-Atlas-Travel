# Architecture

## System boundary

The Next.js application is the operator console. HappyRobot is expected to own agent execution, channel integrations, conversation memory, and workflow state. The dashboard reads an aggregated view through a server-only adapter.

```text
Lead channels -> HappyRobot agents -> HappyRobot workflow state
                                           |
                                           v
                                  dashboard live endpoint
                                           |
                                           v
                              Next.js server adapter and schema
                                           |
                                           v
                               Operator dashboard and controls
```

## Data flow

1. The browser requests `/api/dashboard/live`.
2. The server checks whether HappyRobot credentials are configured.
3. In live mode, the server calls the configured endpoint with a server-side API key.
4. The response is validated and normalized.
5. If live mode is not configured, or the payload is invalid, demo fixtures are returned with `source: "mock"`.

The generic `/api/happyrobot/twindb` route is restricted to explicit endpoints in `HAPPYROBOT_TWINDB_ALLOWED_ENDPOINTS`. It is not an unrestricted upstream proxy.

## Production recommendation

For a real deployment, replace the generic proxy with task-specific routes for actions such as human takeover, approve draft, pause agent, and schedule meeting. Each route should validate authorization, tenant ownership, input, and the resulting state transition.
