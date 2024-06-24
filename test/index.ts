import cronJobNode, { setHost, cronJobNodeDataT } from "../src";

const run = async () => {
  setHost("https://job.test.mn");
  const list: cronJobNodeDataT = [
    {
      id: "21321321",
      config: {
        method: "get",
        maxBodyLength: "Infinity",
        url: "https://api.test.mn/v1/get-token",
        headers: {},
      },
      job_time: "* * * * *",
      status: true,
      type_name: "dev",
    },
  ];
  await cronJobNode(list);
};
run();
