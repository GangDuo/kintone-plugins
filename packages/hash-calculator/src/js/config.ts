// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const form = document.querySelector(".js-submit-settings");
const cancelButton = document.querySelector(".js-cancel-button");
if (!(form && cancelButton)) {
  throw new Error("Required elements do not exist.");
}
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.alwaysOverwrites && JSON.parse(config.alwaysOverwrites)) {
  (<HTMLInputElement>document.getElementById('radio-1')).checked = true;
}
if(config.rows) {
  console.log(JSON.parse(config.rows));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const rows = [];
  const trs  = document.querySelectorAll(`.kintoneplugin-table tbody tr`);
  for (let i = 0; i < trs.length; i++) {
    const element = trs[i];
    const values = Array.from(element.querySelectorAll('td')).map(td => td.querySelector('select')?.value);
    rows.push(values);
  }

  kintone.plugin.app.setConfig({
    alwaysOverwrites: JSON.stringify(alwaysOverwrites()),
    rows: JSON.stringify(rows)
  });
});
cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});

function alwaysOverwrites(): boolean {
  const radios = Array.from(document.getElementsByName('radio')).filter(input => (<HTMLInputElement>input).checked);
  const code = (<HTMLInputElement>radios[0]).value;
  return !!parseInt(code);
}