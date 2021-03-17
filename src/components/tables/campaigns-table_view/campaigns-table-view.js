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
import Avatar from "@material-ui/core/Avatar";
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";


const headCells = [
    { id: 'cover', align: 'left', label: '', tooltip: 'Обложка продвигаемого релиза' },
    { id: 'artist', align: 'left', label: 'Исполнитель', tooltip: 'Исполнитель (исполнители) продвигаемого релиза' },
    { id: 'title', align: 'left', label: 'Название', tooltip: 'Название продвигаемого релиза' },
    { id: 'status', align: 'right', label: 'Статус', tooltip: 'Статус кампании' },
    { id: 'auto', align: 'right', label: 'Авт.', tooltip: 'Автоматизация ведения кампании' },
    { id: 'spent', align: 'right',  label: 'Потрачено', tooltip: 'Потраченная сумма в рублях' },
    { id: 'reach', align: 'right',  label: 'Показы', tooltip: 'Показы объявлений' },
    { id: 'cpm', align: 'right',  label: 'CPM', tooltip: 'Стоимость тысячи показов в рублях' },
    { id: 'listens', align: 'right',  label: 'Прослушивания', tooltip: 'Прослушивания на плейлистах (не равно стримы)' },
    { id: 'cpl', align: 'right',  label: 'CPL', tooltip: 'Cost Per Listen - стоимость одного прослушивания в рублях' },
    { id: 'ltr', align: 'right',  label: 'LTR', tooltip: 'Listen Through Rate - конверсия из показов в прослушивания' },
    { id: 'saves', align: 'right',  label: 'Добавления', tooltip: 'Сохранения аудио и плейлистов из объявлений в аудиозаписях пользователей' },
    { id: 'cps', align: 'right',  label: 'CPS', tooltip: 'Cost Per Save - стоимость одного сохранения в рублях' },
    { id: 'str', align: 'right',  label: 'STR', tooltip: 'Save Through Rate - конверсия из показов в добавления' },
    { id: 'date', align: 'right',  label: 'Дата', tooltip: 'Дата создания кампании' },
]


const icons = [

    <Tooltip title='Остановлена' >
        <TableCell align="right" >
            <StopIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущена' >
        <TableCell align="right">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Архивирована'>
        <TableCell align="right" >
            <DeleteIcon color='disabled'/>
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


export default function CampaignsTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const { rows } = props
    const coverSize = dense ? {width: 30, height: 30} : {width: 50, height: 50}

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

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    <Avatar src={row.cover} alt='cover' style={coverSize} />
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    {row.artist}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    {row.title}
                                                </Link>
                                            </TableCell>

                                            { icons[row.status] }
                                            { icons[row.isAutomate] }

                                            <TableCell align="right">{row.spent}</TableCell>
                                            <TableCell align="right">{row.reach}</TableCell>
                                            <TableCell align="right">{row.cpm}</TableCell>
                                            <TableCell align="right">{row.listens}</TableCell>
                                            <TableCell align="right">{row.cpl}</TableCell>
                                            <TableCell align="right">{row.ltr}</TableCell>
                                            <TableCell align="right">{row.saves}</TableCell>
                                            <TableCell align="right">{row.cps}</TableCell>
                                            <TableCell align="right">{row.str}</TableCell>
                                            <TableCell align="right">{row.date}</TableCell>

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
