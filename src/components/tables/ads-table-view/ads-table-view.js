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
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import LinkIcon from '@material-ui/icons/Link';
import HelpIcon from '@material-ui/icons/Help';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';


function spacedNumber(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}


const headCells = [
    { id: 'name', align: 'left', label: 'Сегмент', tooltip: 'Аудитория, которой показывается объявление' },
    { id: 'approved', align: 'right', label: 'Модерация', tooltip: 'Статус модерации объявления' },
    { id: 'status', align: 'right', label: 'Статус', tooltip: 'Статус объявления' },
    { id: 'spent', align: 'right',  label: 'Потрачено', tooltip: 'Потраченная сумма в рублях' },
    { id: 'reach', align: 'right',  label: 'Показы', tooltip: 'Показы объявлений' },
    { id: 'cpm', align: 'right',  label: 'CPM', tooltip: 'Стоимость тысячи показов в рублях' },
    { id: 'listens', align: 'right',  label: 'Прослушивания', tooltip: 'Прослушивания на плейлистах (не равно стримы)' },
    { id: 'cpl', align: 'right',  label: 'CPL', tooltip: 'Cost Per Listen - стоимость одного прослушивания в рублях' },
    { id: 'ltr', align: 'right',  label: 'LTR', tooltip: 'Listen Through Rate - конверсия из охвата в прослушивания' },
    { id: 'saves', align: 'right',  label: 'Добавления', tooltip: 'Сохранения аудио и плейлистов из объявлений в аудиозаписях пользователей' },
    { id: 'cps', align: 'right',  label: 'CPS', tooltip: 'Cost Per Save - стоимость одного сохранения в рублях' },
    { id: 'str', align: 'right',  label: 'STR', tooltip: 'Save Through Rate - конверсия из охвата в добавления' },
    { id: 'ad', align: 'right',  label: 'Объявление', tooltip: 'Ссылка на объявление в рекламном кабинете ВК' },
    { id: 'post', align: 'right',  label: 'Пост', tooltip: 'Ссылка на пост в ВК' },
]


const statusIcons = [

    <Tooltip title='Остановлено'>
        <TableCell align="right">
            <StopIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущено'>
        <TableCell align="right">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Удалено'>
        <TableCell align="right">
            <DeleteIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

]

const approvedIcons = [

    <Tooltip title='Не проходило модерацию'>
        <TableCell align="right">
            <HelpIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='На модерации'>
        <TableCell align="right">
            <HourglassFullIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Одобрено'>
        <TableCell align="right">
            <DoneIcon color='action'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Отклонено'>
        <TableCell align="right">
            <CloseIcon color='disabled'/>
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


export default function AdsTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('saves');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { rows } = props

    const handleClick = (url) => {
        window.open(url)
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
                                            <TableCell align="left">{row.name}</TableCell>
                                            { approvedIcons[row.approved] }
                                            { statusIcons[row.status] }
                                            <TableCell align="right">{spacedNumber(row.spent)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.reach)}</TableCell>
                                            <TableCell align="right">{row.cpm}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.listens)}</TableCell>
                                            <TableCell align="right">{row.cpl}</TableCell>
                                            <TableCell align="right">{row.ltr}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.saves)}</TableCell>
                                            <TableCell align="right">{row.cps}</TableCell>
                                            <TableCell align="right">{row.str}</TableCell>

                                            <Tooltip title='Открыть объявление в ВК'>
                                                <TableCell align="right" onClick={() => {handleClick(row.adUrl)}}>
                                                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                </TableCell>
                                            </Tooltip>

                                            <Tooltip title='Открыть пост в ВК'>
                                                <TableCell align="right" onClick={() => {handleClick(row.postUrl)}} >
                                                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                </TableCell>
                                            </Tooltip>

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
