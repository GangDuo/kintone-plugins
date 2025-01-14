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
  const app = (<HTMLInputElement>document.getElementById("appList")).value;
  switch (getContentId()) {
    case 0:
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
      const { layout } = await kintone.api(
        kintone.api.url('/k/v1/app/form/layout.json', true),
        'GET',
        { app }
      );
      console.dir(layout);
      writeThenDownload('layout.json', JSON.stringify(layout));


      break;
  
    case 2: {
      const { properties } = await kintone.api(
        kintone.api.url('/k/v1/app/form/fields.json', true),
        'GET',
        { app }
      );
      writeThenDownload('fields.json', JSON.stringify(properties));
      break;
    }

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

function writeThenDownload(fname:string, payload: string): string {
  if(typeof Blob !== 'undefined') {
    var blob = new Blob([payload], {type:"application/json"});
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    if (a.download != null) {
      a.download = fname; a.href = url; document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      if (URL.revokeObjectURL && typeof setTimeout !== 'undefined') setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      return url;
    }
  }
  throw new Error("cannot save file " + fname);
}