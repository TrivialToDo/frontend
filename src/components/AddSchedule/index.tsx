// float button for adding new schedule

import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const AddSchedule = () => {
    return <>
        <FloatButton
            shape="circle"
            type="primary"
            style={{ right: 50 }}
            icon={<PlusOutlined />}
            onClick={() => {/*TODO: ADD schedule*/ }}
        />
    </>;
};
