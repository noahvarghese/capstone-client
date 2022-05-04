import React from "react";
import { BaseProps } from ".";

export interface HiddenProps extends BaseProps {
    value: string | number | boolean;
}

const Hidden: React.FC<HiddenProps> = ({ value }) => {
    return <input type="hidden" disabled={true} value={value.toString()} />;
};

export default Hidden;
