// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as XLSX from "xlsx";

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
  switch (getContentId()) {
    case 0:
      const app = (<HTMLInputElement>document.getElementById("appList")).value;

      const { properties } = await kintone.api(
        kintone.api.url('/k/v1/form.json', true),
        'GET',
        { app }
      );
    
      /* https://docs.sheetjs.com/docs/getting-started/examples/export */
      /* generate worksheet and workbook */
      const worksheet = XLSX.utils.json_to_sheet(properties);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "sheetName");
    
      /* create an XLSX file and try to save to Form.xlsx */
      XLSX.writeFile(workbook, "Form.xlsx", { compression: true });
    
      break;

    case 1:
      console.error('Not implemented');
      break;
  
    default:
      console.error('Not implemented');
      break;
  }
});

function getContentId(): number {
  const radios = Array.from(document.getElementsByName('radio')).filter(input => (<HTMLInputElement>input).checked);
  const code = (<HTMLInputElement>radios[0]).value;
  return parseInt(code);
}