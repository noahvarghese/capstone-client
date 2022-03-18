import {
    CheckBoxOutlineBlankRounded,
    CheckBox,
    KeyboardArrowDown,
} from "@mui/icons-material";
import { Alert, AppBar, Box, Collapse, Paper, Typography } from "@mui/material";
import { convertFromRaw, EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Content, ManualSection } from "./ManualSectionView";
import { Manual } from "./ManualsList";

const UserManualView: React.FC = () => {
    const { id } = useParams();
    const [manual, setManual] = useState<Manual | undefined>();
    const [sections, setSections] = useState<ManualSection[]>([]);
    const [selectedSection, setSelectedSection] = useState<
        ManualSection | undefined
    >();
    const [sectionContents, setSectionContents] = useState<
        (Content & { read: boolean })[]
    >([]);
    const [selectedContent, setSelectedContent] = useState<
        Content | undefined
    >();

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const [open, setOpen] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        };

        Promise.all([
            fetch(server(`/manuals/${id}`), fetchOptions).then((res) =>
                res.json().then(setManual)
            ),
            fetch(server(`/manuals/${id}/sections`), fetchOptions).then((res) =>
                res.json().then(setSections)
            ),
        ]).catch((e) => {
            setAlert({ message: (e as Error).message, severity: "error" });
        });

        return () => {
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        if (selectedSection || refresh) {
            // must have a selected section
            if (!selectedSection) return;

            const controller = new AbortController();

            fetch(server(`/manuals/sections/${selectedSection.id}/contents`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then((res) => res.json())
                .then((data) =>
                    Promise.all(
                        data.map((c: Content) =>
                            fetch(
                                server(
                                    `/manuals/sections/contents/${c.id}/read`
                                ),
                                {
                                    method: "GET",
                                    credentials: "include",
                                    mode: "cors",
                                    signal: controller.signal,
                                }
                            )
                                .then((res) => res.json())
                                .then((r) => ({ ...c, read: r }))
                        )
                    ).then(setSectionContents)
                )
                .catch((e) => {
                    setAlert({
                        message: (e as Error).message,
                        severity: "error",
                    });
                })
                .finally(() => {
                    if (refresh) setRefresh(false);
                });

            return () => {
                controller.abort();
            };
        }
    }, [refresh, selectedSection]);

    if (!manual) {
        return <Loading />;
    }

    return (
        <div
            style={{
                minHeight: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: "18rem" }}>
                    <Collapse
                        component={Paper}
                        orientation="vertical"
                        collapsedSize="3rem"
                        in={open}
                        onClick={() => setOpen(!open)}
                    >
                        <Box
                            style={{
                                cursor: "pointer",
                                margin: 0,
                                padding: "0.5rem 1rem",
                                color: "white",
                                backgroundColor: "black",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            <Typography
                                variant="h5"
                                variantMapping={{ h5: "h3" }}
                            >
                                Table of Contents
                            </Typography>
                            <Box>
                                <KeyboardArrowDown
                                    style={{
                                        fontSize: "2rem",
                                        transition: "all 0.3s ease-in-out",
                                        transform: `rotate(${
                                            open ? "0deg" : "180deg"
                                        })`,
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box>
                            {sections.map((s) => (
                                <div key={`sections${s.id}`}>
                                    <Collapse
                                        key={`sections${s.id}`}
                                        orientation="vertical"
                                        collapsedSize="3rem"
                                        in={selectedSection?.id === s.id}
                                    >
                                        <Box
                                            style={{
                                                cursor: "pointer",
                                                margin: 0,
                                                padding: "0.5rem 1rem",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "1rem",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (
                                                    selectedSection?.id === s.id
                                                ) {
                                                    setSelectedSection(
                                                        undefined
                                                    );
                                                    setSelectedContent(
                                                        undefined
                                                    );
                                                } else {
                                                    setSelectedSection(s);
                                                }
                                            }}
                                        >
                                            <Box>
                                                <KeyboardArrowDown
                                                    style={{
                                                        fontSize: "2rem",
                                                        transition:
                                                            "all 0.3s ease-in-out",
                                                        transform: `rotate(${
                                                            selectedSection?.id ===
                                                            s.id
                                                                ? "0deg"
                                                                : "180deg"
                                                        })`,
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body1">
                                                {s.title}
                                            </Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                cursor: "pointer",
                                                margin: 0,
                                                padding: "0.5rem 4rem ",
                                                borderRadius: "4px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                gap: "1rem",
                                            }}
                                        >
                                            {selectedSection?.id === s.id
                                                ? sectionContents.map((c) => (
                                                      <Box
                                                          style={{
                                                              width: "100%",
                                                              display: "flex",
                                                              alignItems:
                                                                  "center",
                                                              justifyContent:
                                                                  "space-between",
                                                          }}
                                                          key={`contents${c.id}`}
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              setSelectedContent(
                                                                  c
                                                              );
                                                              if (!c.read) {
                                                                  fetch(
                                                                      server(
                                                                          `/manuals/sections/contents/${c.id}/read`
                                                                      ),
                                                                      {
                                                                          method: "POST",
                                                                          credentials:
                                                                              "include",
                                                                          mode: "cors",
                                                                      }
                                                                  ).then(() =>
                                                                      setRefresh(
                                                                          true
                                                                      )
                                                                  );
                                                              }
                                                          }}
                                                      >
                                                          {c.title}
                                                          <Box
                                                              style={{
                                                                  display:
                                                                      "flex",
                                                                  alignItems:
                                                                      "center",
                                                                  gap: "0.5rem",
                                                                  color: "#6F7E8C",
                                                              }}
                                                          >
                                                              <Typography>
                                                                  read:
                                                              </Typography>
                                                              {c.read ? (
                                                                  <CheckBox />
                                                              ) : (
                                                                  <CheckBoxOutlineBlankRounded />
                                                              )}
                                                          </Box>
                                                      </Box>
                                                  ))
                                                : null}
                                        </Box>
                                    </Collapse>
                                </div>
                            ))}
                        </Box>
                    </Collapse>
                </div>
                <Paper
                    style={{
                        margin: "auto",
                        width: "50vw",
                    }}
                >
                    <Box>
                        <AppBar
                            sx={{
                                position: "unset",
                                padding: "1rem 2rem",
                                borderRadius: "4px",
                            }}
                        >
                            <Typography
                                variant="h1"
                                style={{ color: "white", textAlign: "left" }}
                            >
                                {manual.title.toUpperCase()}
                            </Typography>
                        </AppBar>
                        <Box
                            sx={{
                                padding: "2rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2rem",
                            }}
                        >
                            {selectedContent ? (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "1rem",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            style={{ fontSize: "1.25rem" }}
                                        >
                                            {manual.title}
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: "2rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            variant="body1"
                                        >
                                            &#8250;
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            style={{ fontSize: "1.25rem" }}
                                        >
                                            {selectedSection?.title}
                                        </Typography>
                                        <Typography
                                            style={{ fontSize: "2rem" }}
                                            variant="body1"
                                        >
                                            &#8250;
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            style={{ fontSize: "1.25rem" }}
                                        >
                                            {selectedContent?.title}
                                        </Typography>
                                    </Box>
                                    <Editor
                                        readOnly={true}
                                        editorStyle={{
                                            minHeight: "15rem",
                                            padding: "0",
                                        }}
                                        toolbarClassName="toolbarClassName"
                                        editorState={
                                            selectedContent?.content
                                                ? EditorState.createWithContent(
                                                      convertFromRaw(
                                                          selectedContent.content
                                                      )
                                                  )
                                                : EditorState.createEmpty()
                                        }
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                        toolbarHidden={true}
                                    />
                                </>
                            ) : null}
                        </Box>
                    </Box>
                </Paper>
            </Box>
            {alert.severity && (
                <Alert
                    severity={alert.severity}
                    style={{ marginTop: "2rem" }}
                    onClose={() =>
                        setAlert({ message: "", severity: undefined })
                    }
                >
                    {alert.message}
                </Alert>
            )}
        </div>
    );
};

export default UserManualView;
