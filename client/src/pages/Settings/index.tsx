import { observer } from "mobx-react-lite";
import "react-range-slider-input/dist/style.css";
import { useMobxStores } from "../../hooks/useMobxStores";
import "./index.css";

const Settings = observer(() => {
    const {} = useMobxStores();

    return (
        <div className="settings-container">
            <div className="settings-header">No settings</div>
        </div>
    );
});

export default Settings;
