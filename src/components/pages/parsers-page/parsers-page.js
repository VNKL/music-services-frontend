import React from "react";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ParsersTable from "./parsers-table";


const ParsersPage = () => {

    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_parser' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новый парсинг
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={12}>
                <ParsersTable />
            </Grid>

        </Grid>
    )
}


export default ParsersPage