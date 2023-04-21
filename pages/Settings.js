import * as React from "react";
import _ from "lodash";
import { restdbPut, restdbPost, restdbDelete } from "../utils/api_client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  useGridApiRef,
  useGridApiContext,
  GridToolbar,
  GridActionsCellItem,
  GridRowModes,
  GridFooterContainer,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useRecoilState } from "recoil";
import { EdittedQnBnkSelector } from "../state/quizState";

const toolbarSx = {
  "& .MuiDataGrid-virtualScroller": {
    "&::-webkit-scrollbar": {
      "&:horizontal{}": {
        width: 4,
      },
      "&:vertical{}": {
        height: 4,
      },
    },
    "&::-webkit-scrollbar-track": {
      background: (theme) => theme.palette.background.default,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: (theme) => theme.palette.action.selected,
      borderRadius: 24,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: (theme) => theme.palette.primary.main,
    },
    "&::-webkit-scrollbar-corner": {
      background: (theme) => theme.palette.background.default,
    },
    "& .MuiDataGrid-actionsCell": {
      gridGap: 0,
    },
  },
};

export default function Settings() {
  const [rows, setRows] = useRecoilState(EdittedQnBnkSelector);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    console.log(rows);
  }, []);

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [
        ...oldRows,
        {
          _id: id,
          Question: "",
          Option1: "",
          Option2: "",
          Option3: "",
          Option4: "",
          Answer: [],
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "Question" },
      }));
      apiRef.current.scrollToIndexes({
        rowIndex: rows.length - 1,
        colIndex: 0,
      });
    };

    return (
      <GridFooterContainer>
        <Button startIcon={<AddIcon />} onClick={handleClick}>
          Add Question
        </Button>
      </GridFooterContainer>
    );
  }

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const qnsObj = apiRef.current.getRowWithUpdatedValues(id);
    const { _id, isNew, ...body } = qnsObj;
    //console.log(_id);
    //console.log(_.isObject(body));
    //console.log(_.isArray(body));
    //console.log(_.isBoolean(isNew));
    if (_.isBoolean(isNew)) {
      console.log("new");
      //console.log(body);
      restdbPost("/quiz", body);
    } else {
      console.log("existing");
      restdbPut(`/quiz/${_id}`, body);
    }
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row._id !== id));
    restdbDelete(`/quiz/${id}`);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  function CustomEditComponent(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    let arr = _.cloneDeep(props.row.Answer);
    const [isIncluded, setIsincluded] = React.useState(
      _.indexOf(arr, field) !== -1
    );

    const handleValueChange = (event) => {
      const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    const handleBoolean = (event) => {
      if (_.indexOf(arr, field) !== -1) {
        arr = arr.filter((a) => a !== field);
        apiRef.current.setEditCellValue({ id, field: "Answer", value: arr });
        setIsincluded(false);
      } else {
        arr = _.sortBy([...arr, field]);
        apiRef.current.setEditCellValue({ id, field: "Answer", value: arr });
        setIsincluded(true);
      }
    };
    return (
      <>
        <InputBase
          multiline
          sx={{ fontSize: "0.875rem" }}
          value={value}
          onChange={handleValueChange}
        />
        <Tooltip title="Check if correct option" disableInteractive>
          <Checkbox checked={isIncluded} onChange={handleBoolean} />
        </Tooltip>
      </>
    );
  }

  const CustomViewComponent = (props) => {
    const { value, field } = props;
    const arr = props.row.Answer;

    return (
      <>
        <Box sx={{ flexGrow: 1 }}>{value}</Box>
        <Checkbox disabled checked={arr.includes(field)} />
      </>
    );
  };

  const columns = [
    {
      field: "Question",
      headerName: "Question",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "Answer",
      headerName: "Answer",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "Option1",
      headerName: "Option 1",
      flex: 1,
      minWidth: 100,
      editable: true,
      renderCell: (params) => <CustomViewComponent {...params} />,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "Option2",
      headerName: "Option 2",
      minWidth: 100,
      flex: 1,
      editable: true,
      renderCell: (params) => <CustomViewComponent {...params} />,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "Option3",
      headerName: "Option 3",
      minWidth: 100,
      flex: 1,
      editable: true,
      renderCell: (params) => <CustomViewComponent {...params} />,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "Option4",
      headerName: "Option 4",
      minWidth: 100,
      flex: 1,
      editable: true,
      renderCell: (params) => <CustomViewComponent {...params} />,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "actions",
      type: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key=""
              icon={<SaveIcon />}
              label="save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3, height: "90vh", width: "100%" }}>
        <DataGrid
          sx={{
            ...toolbarSx,
            "& .MuiDataGrid-row .MuiDataGrid-row--editable .MuiDataGrid-row--editing":
              {
                bgcolor: "green",
              },
            "& .MuiDataGrid-row--editing .MuiDataGrid-cell": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
            },
          }}
          apiRef={apiRef}
          rowModesModel={rowModesModel}
          rows={rows}
          getRowId={(row) => row._id}
          getRowHeight={() => "auto"}
          editMode="row"
          columns={columns}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          columnBuffer={2}
          columnThreshold={2}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
            footer: EditToolbar,
          }}
          slotProps={{
            footer: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </Container>
  );
}
