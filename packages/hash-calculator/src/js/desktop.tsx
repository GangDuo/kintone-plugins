import React from 'react';
import ReactDOM from 'react-dom/client';

interface DesktopUiProps {
  kintonePluginId: string;
}

const DesktopUi: React.FC<DesktopUiProps> = (props) => {
  const config = React.useMemo(() => {
    return kintone.plugin.app.getConfig(props.kintonePluginId);
  }, []);

  return (
    <>
      <h3 className="plugin-space-heading">Hello kintone plugin!</h3>
      <p className="plugin-space-message">{config.message}</p>
    </>
  );
};

(PLUGIN_ID => {
  kintone.events.on("app.record.index.show", () => {
  
    const spaceElement = kintone.app.getHeaderSpaceElement();
    if (spaceElement === null) {
      throw new Error("The header element is unavailable on this page");
    }

    const root = ReactDOM.createRoot(spaceElement);
    root.render(
      <React.StrictMode>
        <DesktopUi kintonePluginId={PLUGIN_ID}/>
      </React.StrictMode>
    );
  });
})(kintone.$PLUGIN_ID);