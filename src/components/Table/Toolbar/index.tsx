import {
    alpha,
    Typography,
    Tooltip,
    IconButton,
    Theme,
    Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import React from "react";

const CustomToolbar: React.FC<{
    numSelected: number;
    onDelete: () => void;
    title: string;
    toolBarItems: React.ReactElement[];
}> = ({ title, numSelected, toolBarItems, onDelete }) => {
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
                <Tooltip title="Delete">
                    <IconButton onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
            {numSelected === 1 && (
                <Tooltip title="Edit">
                    <IconButton
                        onClick={() => {
                            return;
                        }}
                    >
                        <ModeEditIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default CustomToolbar;
