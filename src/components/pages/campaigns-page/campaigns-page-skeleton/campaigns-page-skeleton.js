import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from "@material-ui/core/Grid";


const CampaignsPageSkeleton = () => {
    return (
        <Grid container spacing={4} alignItems='center'>

            <Grid item xs={12} sm={12} align='right'>
                <Skeleton variant='rect' height={530}/>
            </Grid>

            <Grid item xs={2} sm={2} align='left'>
                <Skeleton variant='rect' height={50}/>
            </Grid>


        </Grid>
    )
}


export default CampaignsPageSkeleton