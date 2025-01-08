// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as XLSX from "xlsx";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const form = document.querySelector(".js-submit-settings");
const cancelButton = document.querySelector(".js-cancel-button");
const messageInput =
  document.querySelector<HTMLInputElement>(".js-text-message");
if (!(form && cancelButton && messageInput)) {
  throw new Error("Required elements do not exist.");
}
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.message) {
  messageInput.value = config.message;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig({ message: messageInput.value }, () => {
    alert("The plug-in settings have been saved. Please update the app!");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
document.querySelector(".js-export-button")?.addEventListener("click", async () => {
  const app = document.querySelector<HTMLInputElement>(".js-text-app")?.value;
  if (!app) {
    throw new Error("アクセス先アプリIDに入力してください。");
  }

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
});