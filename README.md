# cron-job-node

Хуваарьт HTTP ажлуудаа **cron-job** сервис рүү бүртгэх хөнгөн Node.js / TypeScript SDK.
A tiny, dependency-light SDK to register scheduled HTTP jobs with a `cron-job` backend.

[![npm](https://img.shields.io/npm/v/cron-job-node.svg)](https://www.npmjs.com/package/cron-job-node)

---

## Онцлог / Features

- 🎯 Нэг дуудлагаар олон ажлыг бүртгэх / шинэчлэх (upsert by `id`)
- 🌍 `prod` / `staging` / `test` / `dev` орчны тэмдэглэгээ
- 🔑 (Сонголт) API key дэмжлэг — `setApiKey()`
- 🧾 (Сонголт) ажил бүрийн гүйцэтгэлийн log асаах — `log_enabled`
- 📦 TypeScript төрлүүд дагалдана
- ♻️ **1.0.x-тэй бүрэн нийцтэй** — хуучин код өөрчлөлтгүй ажиллана

---

## Суулгах / Install

```bash
npm install cron-job-node
```

---

## Хэрэглээ / Usage

```ts
import cronJobNode, { setHost, setApiKey, CronJobNodeData } from "cron-job-node";

const run = async () => {
  setHost("https://job.test.mn");
  // Хэрэв сервер API key шаарддаг / ашигладаг бол:
  setApiKey("cj_xxxxxxxxxxxxxxxx"); // заавал биш

  const list: CronJobNodeData = [
    {
      id: "21321321",
      config: {
        method: "get",
        maxBodyLength: "Infinity",
        url: "https://api.test.mn/v1/get-token",
        headers: {}
      },
      job_time: "* * * * *", // минут тутам
      status: true,
      type_name: "dev",
      log_enabled: true // сонголт — гүйцэтгэлийн log бичнэ
    }
  ];

  const ok = await cronJobNode(list);
  console.log("registered:", ok); // true | false
};

run();
```

---

## API

### `setHost(url: string): void`
Cron сервисийн үндсэн хаягийг тохируулна. Ж: `setHost("https://job.test.mn")`.

### `setApiKey(key: string): void`
API key тохируулна. Тохируулсан бол хүсэлт бүрд `x-api-key` header-ээр илгээнэ.
Сервер талд API key **заавал биш** тул хуучин хэрэглээ хэвээрээ ажиллана.

### `configure(opts): void`
`{ host?, apiKey?, timeout? }` — хэд хэдэн тохиргоог нэг дор өгнө.

```ts
import { configure } from "cron-job-node";
configure({ host: "https://job.test.mn", apiKey: "cj_...", timeout: 30000 });
```

### `cronJobNode(data, url?): Promise<boolean>` (default export)
Ажлуудын жагсаалтыг сервис рүү илгээж бүртгэнэ/шинэчилнэ.
Амжилттай (HTTP 2xx) бол `true`, эс бөгөөс `false`.

| Параметр | Төрөл | Тайлбар |
|----------|-------|---------|
| `data`   | `CronJobNodeData` | Ажлуудын жагсаалт |
| `url`    | `string?` | (сонголт) `setHost`-ийг түр дарж илгээх хаяг |

### Төрлүүд / Types

```ts
type CronJobItem = {
  id: string;
  config: AxiosRequestConfig | Record<string, any>;
  job_time: string;                               // cron: "* * * * *"
  status: boolean;                                // идэвхтэй эсэх
  type_name: "prod" | "staging" | "test" | "dev"; // орчин
  log_enabled?: boolean;                          // сонголт
};

type CronJobNodeData = CronJobItem[];
```

> `cronJobNodeDataT` нэр хуучин кодод зориулж хэвээр үлдсэн (`CronJobNodeData`-ийн alias).

---

## 1.0.x → 1.1.0 шилжилт / Migration

Эвдрэлгүй (**non-breaking**). Хуучин код ямар ч өөрчлөлтгүй ажиллана:

```ts
import cronJobNode, { setHost, cronJobNodeDataT } from "cron-job-node";
setHost("https://job.test.mn");
await cronJobNode(list); // хэвээр
```

Шинэ нэмэгдсэн зүйлс: `setApiKey()`, `configure()`, `log_enabled`, `"test"` орчин,
илүү тодорхой төрлийн нэрс. `axios` одоо шууд dependency болсон (өмнө нь хэрэглэгч тус
тусдаа суулгах шаардлагатай байв).

---

## License

ISC © TOGTOKH.DEV
