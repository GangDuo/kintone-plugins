// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { ContentCreator } from "./content";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const cancelButton = document.querySelector(".js-cancel-button");
if (!(cancelButton)) {
  throw new Error("Required elements do not exist.");
}

// アプリ情報を取得する
kintone.api(
  kintone.api.url('/k/v1/apps.json', true),
  'GET',
  { },
  (res: any) => {
    // 「アプリ名」を選択肢にしてセレクトボックスに追加
    const { apps } = res;
    apps.forEach((app: any) => {
      const newElement = document.createElement('option');
      newElement.textContent = app.name;
      newElement.value = app.appId;
      document.getElementById('appList')?.appendChild(newElement);
    });
  },
  (err: any) => console.error(err)
);

cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
document.querySelector(".js-export-button")?.addEventListener("click", async () => {
  const app = (<HTMLInputElement>document.getElementById("appList")).value;
  const instance = ContentCreator(getContentId(), { app });
  await instance.process();
});

function getContentId(): number {
  const radios = Array.from(document.getElementsByName('radio')).filter(input => (<HTMLInputElement>input).checked);
  const code = (<HTMLInputElement>radios[0]).value;
  return parseInt(code);
}