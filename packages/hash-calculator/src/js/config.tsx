import React from 'react';
import ReactDOM from 'react-dom/client';

interface ConfigUiProps {
  kintonePluginId: string;
}

interface RadioButtonProps<T = number> {
  label: string
  value: T
}

const ConfigUi: React.FC<ConfigUiProps> = (props) => {
  const [ selected, setSelected ] = React.useState(0);
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(parseInt(e.target.value))
  }, []);
  const radioButtons: RadioButtonProps[] = [
    { label: "出力フィールドが未入力であるならハッシュ値を設定する", value: 0 },
    { label: "常に上書き", value: 1 }
  ];
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rows = [];
    const trs  = document.querySelectorAll(`.kintoneplugin-table tbody tr`);
    for (let i = 0; i < trs.length; i++) {
      const element = trs[i];
      const values = Array.from(element.querySelectorAll('td')).map(td => td.querySelector('select')?.value);
      rows.push(values);
    }
  
    kintone.plugin.app.setConfig({
      alwaysOverwrites: JSON.stringify(!!selected),
      rows: JSON.stringify(rows)
    });  
  }, [selected]);
  const handleClickOfCancel = React.useCallback(() => {
    window.location.href = "../../" + kintone.app.getId() + "/plugin/";
  }, []);

  React.useEffect(() => {
    const config = kintone.plugin.app.getConfig(props.kintonePluginId);
    console.log(config);
    if (JSON.parse(config.alwaysOverwrites)) {
      setSelected(1);
    }
    if(config.rows) {
      //console.log(JSON.parse(config.rows));
    }
  }, []);

  return (
    <section className="settings">
      <h2 className="settings-heading">ハッシュ計算機の設定</h2>
      <p className="kintoneplugin-desc">レコード保存時にハッシュ値を計算し出力フィールドに保存します。</p>
      <form className="js-submit-settings">
        <div className="kintoneplugin-input-radio">
          
            {radioButtons.map((radio, i) => {
              return (
                <span key={i} className="kintoneplugin-input-radio-item">
                  <input type="radio" name="radio" value={radio.value} id={`radio-${radio.value}`} checked={radio.value === selected} onChange={handleChange} />
                  <label htmlFor={`radio-${radio.value}`}>{radio.label}</label>
                </span>)
            })
            }          
        </div>

        <table className="kintoneplugin-table">
          <thead>
            <tr>
              <th className="kintoneplugin-table-th"><span className="title">アルゴリズム</span></th>
              <th className="kintoneplugin-table-th"><span className="title">入力</span></th>
              <th className="kintoneplugin-table-th"><span className="title">出力</span></th>
              <th className="kintoneplugin-table-th-blankspace"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="kintoneplugin-table-td-control">
                  <div className="kintoneplugin-table-td-control-value">
                    <div className="kintoneplugin-select-outer">
                      <div className="kintoneplugin-select">
                        <select>
                          <option>CRC32</option>
                        </select>
                      </div>
                    </div>    
                  </div>
                </div>
              </td>
              <td>
                <div className="kintoneplugin-table-td-control">
                  <div className="kintoneplugin-table-td-control-value">
                    <div className="kintoneplugin-select-outer">
                      <div className="kintoneplugin-select">
                        <select>
                          <option>レコード番号</option>
                        </select>
                      </div>
                    </div>    
                  </div>
                </div>
              </td>
              <td>
                <div className="kintoneplugin-table-td-control">
                  <div className="kintoneplugin-table-td-control-value">
                    <div className="kintoneplugin-select-outer">
                      <div className="kintoneplugin-select">
                        <select>
                          <option>フィールド名</option>
                        </select>
                      </div>
                    </div>    
                  </div>
                </div>
              </td>
              <td className="kintoneplugin-table-td-operation">
                <button type="button" className="kintoneplugin-button-add-row-image" title="Add row"></button>
                <button type="button" className="kintoneplugin-button-remove-row-image" title="Delete this row"></button>
              </td>
            </tr>
          </tbody>
        </table>
        <p>出力：フィールドタイプが文字列（1行）のみ選択可能。</p>

        <p className="kintoneplugin-row">
            <button type="button" className="js-cancel-button kintoneplugin-button-dialog-cancel" onClick={handleClickOfCancel}>Cancel</button>
            <button className="kintoneplugin-button-dialog-ok" onClick={handleClick}>Save</button>
        </p>
      </form>
    </section>
  );
}; 

(PLUGIN_ID => {
  const root = ReactDOM.createRoot(document.getElementById("configRoot")!!);
  root.render(
    <React.StrictMode>
      <ConfigUi kintonePluginId={PLUGIN_ID}/>
    </React.StrictMode>
  );
})(kintone.$PLUGIN_ID);