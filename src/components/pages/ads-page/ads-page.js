import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService from "../../../services/api-service";
import AdsTableView from "../../tables/ads-table-view";
import AdsHeader from "./ads-header";
import AdsPageSkeleton from "./ads-page-skeleton";


export default class AdsPage extends React.Component {

    state = {
        loading: true,
        ads: null,
        campaign: null,
        hasData: false
    }
    api = new ApiService()

    campaignId = this.props.campaignId

    componentDidMount() {
        this.loadAds()
    }

    loadAds = () => {
        this.api.getAds(this.campaignId).then(this.onAdsLoaded)
    }

    onAdsLoaded = (ads) => {
        if (typeof ads !== 'undefined') {
            this.setState({
                campaign: ads,
                ads: ads.ads,
                loading: false,
                hasData: true
            })
        } else {
            this.setState({
                loading: false,
                hasData: false
            })
        }
    }

    updateStats = () => {
        this.setState({loading: true, ads: null, campaign: null, hasData: false})
        this.api.updateAdsStat(this.campaignId).then(this.onAdsLoaded)
    }

    render() {

        const {loading, hasData, ads, campaign} = this.state
        const header = hasData ? <AdsHeader cover={campaign.cover} name={campaign.name} updateStats={this.updateStats} /> : null
        const table = hasData ? <AdsTableView rows={ads} /> : null
        const spinner = loading ? <AdsPageSkeleton /> : null
        const error = hasData ? null : spinner ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
                    {header}
                    {spinner}
                </Grid>

                <Grid item xs={12}>
                    {table}
                    {error}
                </Grid>

            </Grid>

        )
    }
}