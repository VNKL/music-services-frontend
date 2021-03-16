import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import CampaignsTable from "./campaigns-table";


const CampaignsPage = () => {

    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_campaign' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новую кампанию
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={6} align='right'>
                <Link component={RouterLink} to='/new_automate' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Автоматизировать кампанию
                    </Button>
                </Link>
            </Grid>



            <Grid item xs={12}>
                <CampaignsTable />
            </Grid>

        </Grid>

    )
}


export default CampaignsPage