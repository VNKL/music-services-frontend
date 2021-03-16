import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


const AdsHeader = (props) => {

    const {updateStats} = props

    return (
        <Grid container alignItems='center' spacing={3}>

            <Grid item >
                <Avatar src={props.cover} alt='cover' style={{width: 100, height: 100}} />
            </Grid>

            <Grid item xs>
                <Typography variant='h5'>{props.name}</Typography>
            </Grid>

            <Grid item xs={3} sm={3} align='right'>
                <Button variant='contained'
                        color='secondary'
                        onClick={updateStats}
                >
                    Обновить статистику
                </Button>
            </Grid>

        </Grid>
    )
}


export default AdsHeader