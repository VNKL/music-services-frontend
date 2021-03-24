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

    openCampaignInCabinet = () => {
        const url = `https://vk.com/ads?act=office&union_id=${this.state.campaign.campaignId}`
        window.open(url)
    }

    handleDownload = () => {
        if (this.state.campaign !== null) {
            const campaignId = this.state.campaign.campaignId
            const fileName = `${this.state.campaign.name} (${this.state.campaign.updateDate}).csv`
            this.api.downloadCampaignStats(campaignId, fileName)
        }
    }

    render() {

        const {loading, hasData, ads, campaign} = this.state
        const header = hasData ? <AdsHeader cover={campaign.cover}
                                            name={campaign.name}
                                            updateStats={this.updateStats}
                                            openCampaignInCabinet={this.openCampaignInCabinet}/> : null
        const table = hasData ? <AdsTableView rows={ads} handleDownload={this.handleDownload}/> : null
        const skeleton = loading ? <AdsPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
                    {header}
                    {skeleton}
                </Grid>

                <Grid item xs={12}>
                    {table}
                    {error}
                </Grid>

            </Grid>

        )
    }
}