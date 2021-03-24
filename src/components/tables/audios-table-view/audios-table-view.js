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
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import DoneIcon from '@material-ui/icons/Done';
import LinkIcon from "@material-ui/icons/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";


function spacedNumber(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}


function getHeadCells(needChart, needPost) {
    const headCells = [
        { id: 'mayBeCore', align: 'left', label: 'МБО', tooltip: 'Аудиозапись может быть основной и ' +
                                                                 'включать в себя все добавления копий данной аудиозаписи' },
        { id: 'artist', align: 'left', label: 'Исполнитель', tooltip: 'Исполнитель аудиозаписи' },
        { id: 'title', align: 'left', label: 'Название', tooltip: 'Название аудиозаписи' },
        { id: 'source', align: 'left', label: 'Источник', tooltip: 'Источник добавления. Может работать неточно из-за ' +
                                                                   'особенностей прикрепления аудио к постам' },
    ]
    if (needChart === true) {
        headCells.push({ id: 'chartPosition', align: 'right', label: 'Позиция', tooltip: 'Позиция в чарте' })
    }
    if (needPost) {
        headCells.push({ id: 'postUrl', align: 'right', label: 'Пост', tooltip: 'Ссылка на пост с аудиозаписью. ' +
                'Добавления могут быть не только из этого поста из-за особенностей прикрепления аудио к постам, ' +
                'поэтому для лучшего понимания соотноси их с охватом поста' })
    }
    headCells.push( { id: 'saversCount', align: 'right', label: 'Добавления', tooltip: 'Добавления аудиозаписи' })
    headCells.push({ id: 'date', align: 'right', label: 'Дата загрузки', tooltip: 'Дата загрузки аудиозаписи на сервера ВК' })
    headCells.push({ id: 'parsingDate', align: 'right', label: 'Дата парсинга', tooltip: 'Дата парсинга аудиозаписи' })

    return headCells
}


const icons = [

    <Tooltip title='Не может быть основной' >
        <TableCell align="left" >
            <NotInterestedIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Может быть основной' >
        <TableCell align="left">
            <DoneIcon color='secondary'/>
        </TableCell>
    </Tooltip>

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
    const { classes, order, orderBy, onRequestSort, headCells } = props;
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


export default function AudiosTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('saversCount');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { rows, needChart, needPost, handleDownload, hasCsv } = props

    const headCells = getHeadCells(needChart, needPost)

    const getSixthCell = (chartPosition, postUrl) => {
        if (!needChart && !needPost) {
            return null
        } else if (needPost && postUrl !== undefined) {
            return <Tooltip title='Открыть пост'>
                <TableCell align="right" onClick={() => {handleOpenPost(postUrl)}} >
                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                </TableCell>
            </Tooltip>
        } else if (needChart && chartPosition !== undefined) {
            return <TableCell align="right">{chartPosition}</TableCell>
        } else {
            return <TableCell />
        }
    }

    const handleOpenPost = (url) => {
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
                            headCells={headCells}
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
                                            { icons[row.mayBeCore] }
                                            <TableCell align="left">{row.artist}</TableCell>
                                            <TableCell align="left">{row.title}</TableCell>
                                            <TableCell align="left">{row.source}</TableCell>

                                            { getSixthCell(row.chartPosition, row.postUrl) }

                                            <TableCell align="right">{spacedNumber(row.saversCount)}</TableCell>

                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">{row.parsingDate}</TableCell>


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

            <Grid container>
                <Grid items align='left' xs={6}>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Компактный вид"
                    />
                </Grid>

                <Grid item align='right' xs={6}>
                    { hasCsv ? <Button variant='contained'
                                       color='secondary'
                                       onClick={handleDownload} > Выгрузить таблицей </Button> : null }
                </Grid>

            </Grid>
        </div>
    );
}
