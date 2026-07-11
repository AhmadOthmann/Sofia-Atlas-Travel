# HappyRobot Demo Configuration

The published Sofia workflow can use the application itself for all demo outcomes. Replace `https://YOUR-PUBLIC-URL` after deployment.

## Mission Control

URL:

```text
https://YOUR-PUBLIC-URL/api/webhooks/happyrobot
```

Method: `POST`

Header:

```text
x-webhook-secret: YOUR_HAPPYROBOT_WEBHOOK_SECRET
```

Keep the existing structured body from the Mission Control node. The receiver accepts the 14 extracted qualification fields and safely ignores extra HappyRobot metadata.

## Callback scheduler

URL:

```text
https://YOUR-PUBLIC-URL/api/callbacks
```

Method: `POST`

Use the same `x-webhook-secret` header. Send `caller_name`, `caller_phone`, `requested_at`, and `reason`.

## Consultation booking

Replace the Cal.com placeholder in Sofia's consultation message with:

```text
https://YOUR-PUBLIC-URL/book
```

The included form records a confirmed demo booking and returns the visitor to Mission Control.

## Email action

Email is not required for the self-contained demo. Disable the Maria summary node or use a private test recipient inside HappyRobot. Do not commit a personal address to this public repository.

## Local smoke test

Start the app and seed a complete demo outcome:

```bash
curl -X POST http://localhost:3000/api/demo/seed \
  -H "x-webhook-secret: YOUR_HAPPYROBOT_WEBHOOK_SECRET"
```

Refresh the dashboard. The new qualified lead, callback, and confirmed booking are stored in `.data/sofia-atlas-demo.json`.

## Production secret

Set `HAPPYROBOT_WEBHOOK_SECRET` to a long random value in both local and deployment environments. Use exactly the same value in the HappyRobot webhook headers. The application rejects webhook requests when the secret is not configured.
