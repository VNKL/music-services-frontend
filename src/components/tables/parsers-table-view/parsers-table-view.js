import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import DoneIcon from '@material-ui/icons/Done';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";


function spacedNumber(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}


const headCells = [
    { id: 'methodName', align: 'left', label: 'Метод', tooltip: 'Метод парсинга добавлений' },
    { id: 'methodParam', align: 'left', label: 'Параметр', tooltip: 'Параметр метода парсинга добавлений' },
    { id: 'parsSavers', align: 'center', label: 'Полная база', tooltip: 'Вариант сбора базы: полная база с айди пользователей или только количество добавлений' },
    { id: 'status', align: 'center', label: 'Статус', tooltip: 'Статус парсера' },
    { id: 'audiosCount', align: 'right', label: 'Аудиозаписи', tooltip: 'Количество собранных аудиозаписей' },
    { id: 'saversCount', align: 'right', label: 'Добавления', tooltip: 'Сумма неуникальных добавлений у собранных аудиозаписей' },
    { id: 'resultPath', align: 'right', label: 'База', tooltip: 'Ссылка на скачивание собранной базы' },
    { id: 'startDate', align: 'right', label: 'Дата запуска', tooltip: 'Дата запуска парсера' },
    { id: 'finishDate', align: 'right', label: 'Дата завершения', tooltip: 'Дата завершения парсинга' }
]


const statusIcons = [

    <Tooltip title='Ошибка' >
        <TableCell align="center" >
            <ErrorIcon color='error' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущен' >
        <TableCell align="center">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Завершен'>
        <TableCell align="center" >
            <CheckCircleIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

]


const parsSaversIcons = [

    <Tooltip title='Только количество добавлений' >
        <TableCell align="center" >
            <NotInterestedIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Полная база по добавлниям' >
        <TableCell align="center">
            <DoneIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

]


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <Tooltip title={headCell.tooltip} >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                                ) : null}
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));


export default function ParsersTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('startDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { rows } = props

    const handleDownload = (path) => {
        console.log(path)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>

                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >

                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />

                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={index}
                                        >

                                            <Tooltip title='Открыть результат парсинга'>
                                                <TableCell align="left" >
                                                    <Link component={RouterLink} to={`/parser/${row.id}`} underline='none'>
                                                        {row.methodName}
                                                    </Link>
                                                </TableCell>
                                            </Tooltip>

                                            <Tooltip title='Открыть результат парсинга'>
                                                <TableCell align="left" >
                                                    <Link component={RouterLink} to={`/parser/${row.id}`} underline='none'>
                                                        {row.methodParam}
                                                    </Link>
                                                </TableCell>
                                            </Tooltip>

                                            { parsSaversIcons[row.parsSavers] }
                                            { statusIcons[row.status] }

                                            <TableCell align="right">{spacedNumber(row.audiosCount)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.saversCount)}</TableCell>

                                            <Tooltip title='Скачать результат парсинга'>
                                                <TableCell align="right" onClick={() => {handleDownload(row.resultPath)}} >
                                                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                </TableCell>
                                            </Tooltip>

                                            <TableCell align="right">{row.startDate}</TableCell>
                                            <TableCell align="right">{row.finishDate}</TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={headCells.length} />
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

            </Paper>

            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Компактный вид"
            />
        </div>
    );
}
