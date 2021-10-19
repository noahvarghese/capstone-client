import React from "react";
import { useParams } from "react-router";

const EditMember: React.FC = () => {
    const params = useParams();
    return <div>{params}</div>;
};

export default EditMember;
