import {
    alpha,
    Typography,
    Tooltip,
    IconButton,
    Theme,
    Toolbar,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";

const CustomToolbar: React.FC<{
    title: string;
    numSelected: number;
    handleRefresh?: () => void;
    _delete: React.ReactElement;
    _edit: React.ReactElement;
    _create: React.ReactElement;
    toolBarItems?: React.ReactElement[];
}> = ({
    title,
    numSelected,
    toolBarItems,
    _delete,
    _edit,
    _create,
    handleRefresh,
}) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme: Theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {_create}
            {toolBarItems}
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h1"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 ? (
                _delete
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon id="TableFilter" />
                    </IconButton>
                </Tooltip>
            )}
            {
                // numSelected === 1 && { _edit }
                numSelected === 1 && _edit
                // <Tooltip title="Edit">
                //     <IconButton onClick={onEdit}>
                //         <ModeEditIcon id="TableEdit" />
                //     </IconButton>
                // </Tooltip>
            }
            {numSelected === 0 && handleRefresh && (
                <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh}>
                        <RefreshIcon id="TableRefresh" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default CustomToolbar;
