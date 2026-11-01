# Customer Queue Management – How to run

Three parts run at the same time: **MongoDB** (database), **testing-api** (Node + Express, port 3000)
and **testing-app** (Angular, port 4200).

## 1. Install once

- Node.js (v12 or newer)
- Angular CLI: `npm install -g @angular/cli`
- MongoDB Community Server: https://www.mongodb.com/try/download/community
  (on Windows, leave "Install MongoDB as a Service" ticked so it starts by itself)

## 2. Start the API

```
cd F:\Question\testing\testing-api
npm install
npm start
```

You should see `MongoDB connected: mongodb://127.0.0.1:27017/hospital_queue`.
The database `hospital_queue` and its collections are created automatically on first use.
To use another database, set `MONGODB_URI` before `npm start`.

## 3. Start the Angular app (new terminal)

```
cd F:\Question\testing\testing-app
npm install
ng serve
```

Open http://localhost:4200

> If `ng serve` fails with `ERR_OSSL_EVP_UNSUPPORTED` (happens on Node 17 or newer), run this first
> in the same terminal, then `ng serve` again:
> - Command Prompt: `set NODE_OPTIONS=--openssl-legacy-provider`
> - PowerShell: `$env:NODE_OPTIONS="--openssl-legacy-provider"`

## Pages

| Page | What it does |
|---|---|
| Home | Today's numbers: taken, waiting, registered, plus links to the 3 pages |
| Print Queue Number | Takes the next number (A001, A002 … restarts daily) and prints a ticket with a Code 39 barcode |
| Input Visitor Details | Visitor biodata form, linked to a waiting queue number; department → doctor list |
| Visitor List | Search by name/queue/NIK/phone, filter by department and date, sort, page, delete, export CSV |

## API endpoints (http://localhost:3000/api)

| Method | URL | Purpose |
|---|---|---|
| POST | /queue | Take the next queue number for today |
| GET | /queue?status=waiting | Today's queue numbers (optional status filter) |
| POST | /visitors | Save a visitor (marks their queue number as registered) |
| GET | /visitors?search=&department=&from=&to=&page=&limit=&sort=&order= | Search/list visitors |
| GET | /visitors/:id | One visitor |
| DELETE | /visitors/:id | Delete a visitor |

## MongoDB collections

- `counters` – one document per day holding the last number (atomic increment, so no duplicate numbers)
- `queues` – every ticket taken: number, date, status (waiting / registered)
- `visitors` – visitor details
