
function _type_str_from_type_int(typeInt) {
    if (typeInt === 0) {
        return 'Прослушивания'
    } else {
        return 'Добавления'
    }
}

function _startValue_str_from_int(strValueInt) {
    if (strValueInt === 0) {
        return 'Сразу'
    } else {
        return 'На следующий день'
    }
}

function _stopValue_str_from_int(strValueInt) {
    if (strValueInt === 0) {
        return 'В день запуска'
    } else {
        return 'Вручную'
    }
}

function _realValue_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.cpl
    } else {
        return automate.campaign.cps
    }
}

function _count_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.listens
    } else {
        return automate.campaign.saves
    }
}

function _VTR_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.lr
    } else {
        return automate.campaign.sr
    }
}

function _date_str_from_param(param) {
    if (param) {
        return new Date(param).toLocaleDateString()
    } else {
        return '-'
    }
}


export default class ApiService {
    _apiBaseUrl = 'http://127.0.0.1:8000/api/'
    _vkTokenUrl = `https://oauth.vk.com/authorize?client_id=7669131&display=page&redirect_uri=${this._apiBaseUrl}users.bindVk&scope=360448&response_type=code&v=5.126`

    async bindVk(username) {
        const url = `${this._vkTokenUrl}&state=${username}`
        window.location.replace(url)
    }

    async getResponse(method, params) {
        const fullUrl = new URL(`${this._apiBaseUrl}${method}`)
        fullUrl.search = new URLSearchParams(params).toString()
        const response = await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {Authorization: `JWT ${localStorage.getItem('token')}`},
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log(response.json())
        }
    }

    async createCampaign(camp_params) {
        const params = this._refactor_camp_params(camp_params)
        await this.getResponse('ads.createCampaign', params)
    }

    async createAutomate(automate_params) {
        const params = this._refactor_automate_params(automate_params)
        await this.getResponse('ads.createAutomate', params)
    }

    async getUser() {
        const user = await this.getResponse('users.get')
        if (typeof user !== 'undefined') {
            return this._unpackUser(user)
        }
    }

    async getCampaigns() {
        const campaigns = await this.getResponse('ads.getAllCampaigns')
        if (typeof campaigns !== 'undefined') {
            return this._unpackCampaigns(campaigns)
        }
    }

    async getAutomates() {
        const automates = await this.getResponse('ads.getAllAutomates')
        if (typeof automates !== 'undefined') {
            return this._unpackAutomates(automates)
        }
    }

    async getAds(campaignId) {
        const campaign = await this.getResponse('ads.getCampaign', {id: campaignId, extended: 1})
        if (typeof campaign !== "undefined") {
            return this._unpackCampaign(campaign)
        }
    }

    async stopAutomate(automateId) {
        await this.getResponse('ads.stopAutomate', {id: automateId})
    }

    async updateAdsStat(campaignId) {
        const campaign = await this.getResponse('ads.updateCampaignStats', {id: campaignId, extended: 1})
        if (typeof campaign !== "undefined") {
            return this._unpackCampaign(campaign)
        }
    }

    async getCabsAndGroups() {
        const cabsAndGroups = await this.getResponse('ads.getCabinetsAndGroups')
        if (typeof cabsAndGroups !== 'undefined') {
            return this._unpackCabsAndGroups(cabsAndGroups)
        }
    }

    async getRetarget(cabinet) {
        const retarget = await this.getResponse('ads.getRetarget', cabinet)
        if (typeof retarget !== 'undefined') {
            return this._unpackRetarget(retarget)
        }
    }

    async login(username, password) {
        const response = await fetch(`${this._apiBaseUrl}users.auth`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            },
            body: JSON.stringify({username: username, password: password})
        })
        if (response.ok) {
            return await response.json()
        }
    }

    _unpackUser = (user) => {
        return {
            username: user.username,
            avaUrl: user.ava_url,
            balance: user.balance,
            hasToken: user.has_token,
        }
    }

    _unpackCabsAndGroups = (cabsAndGroups) => {
        return {
            cabinets: cabsAndGroups.cabinets.map((cabinet) => {
                return {
                    cabinetType: cabinet.account_type,
                    cabinetId: cabinet.account_id,
                    cabinetName: cabinet.account_name,
                    clientId: cabinet.client_id,
                    clientName: cabinet.client_name
                }
            }),
            groups: cabsAndGroups.groups.map((group) => {
                return {
                    groupName: group.name,
                    groupId: group.id,
                    groupAvaUrl: group.photo_200
                }
            })
        }
    }

    _unpackRetarget = (retarget) => {
        return retarget.map((item) => {
            return {
                retargetName: item.name,
                retargetId: item.id,
                audienceCount: item.audience_count
            }
        })
    }

    _refactor_camp_params = (params) => {
        let sex = params.sex
        if (params.sex === 'all') {
            sex = ''
        }
        const refactored_params = {
            cabinet_id: params.cabinet,
            group_id: params.group,
            reference_url: params.postUrl,
            money_limit: params.budget,
            sex: sex,
            music: params.musicFilter,
            boom: params.boomFilter,
            age_disclaimer: params.ageDisclaimer,
            age_from: params.ageFrom,
            age_to: params.ageTo,
            musicians: params.musicians,
            groups: params.groupsActive,
            related: params.relatedArtists,
            retarget: params.retargetNames.join('\n'),
            empty_ads: params.emptyAds
        }
        if (typeof params.client !== 'undefined') {
            refactored_params.client_id = params.client
        }
        return refactored_params
    }

    _refactor_automate_params = (params) => {
        const refactored_params = {
            campaign_id: params.campaign,
            target_cost: params.targetCost,
            type: params.type,
        }
        if (params.startTomorrow) {
            refactored_params.start = 1
        }
        else {
            refactored_params.start = 0
        }
        if (params.finishAutomatically) {
            refactored_params.finish = 0
        } else {
            refactored_params.finish = 1
        }
        return refactored_params
    }

    _unpackCampaigns = (campaigns) => {
        return campaigns.map((campaign) => {
            return {
                campaignId: campaign.campaign_id,
                status: campaign.status,
                isAutomate: campaign.is_automate ? 1 : 0,
                hasModerateAudios: campaign.has_moderate_audios,
                audiosIsModerated: campaign.audios_is_moderated,
                artist: campaign.artist,
                title: campaign.title,
                name: campaign.campaign_name,
                spent: campaign.spent.toFixed(2),
                reach: campaign.reach,
                cpm: campaign.cpm.toFixed(2),
                listens: campaign.listens,
                cpl: campaign.cpl.toFixed(2),
                ltr: `${(campaign.lr * 100).toFixed(2)}%`,
                saves: campaign.saves,
                cps: campaign.cps.toFixed(2),
                str: `${(campaign.sr * 100).toFixed(2)}%`,
                cover: campaign.cover_url,
                date: new Date(campaign.create_date).toLocaleDateString()
            }
        })
    }

    _unpackCampaign = (campaign) => {
        return {
            name: `${campaign.artist} - ${campaign.title}`,
            spent: campaign.spent.toFixed(2),
            reach: campaign.reach,
            cpm: campaign.cpm.toFixed(2),
            listens: campaign.listens,
            cpl: campaign.cpl.toFixed(2),
            ltr: `${(campaign.lr * 100).toFixed(2)}%`,
            saves: campaign.saves,
            cps: campaign.cps.toFixed(2),
            str: `${(campaign.sr * 100).toFixed(2)}%`,
            cover: campaign.cover_url,
            date: new Date(campaign.create_date).toLocaleDateString(),
            ads: this._unpackAds(campaign.ads)
        }
    }

    _unpackAds = (ads) => {
        return ads.map((ad) => {
            return {
                approved: ad.approved,
                status: ad.status,
                name: ad.ad_name,
                spent: ad.spent.toFixed(2),
                reach: ad.reach,
                cpm: ad.cpm.toFixed(2),
                listens: ad.listens,
                cpl: ad.cpl.toFixed(2),
                ltr: `${(ad.lr * 100).toFixed(2)}%`,
                saves: ad.saves,
                cps: ad.cps.toFixed(2),
                str: `${(ad.sr * 100).toFixed(2)}%`,
                adUrl: `https://vk.com/ads?act=office&union_id=${ad.ad_id}`,
                postUrl: `https://vk.com/wall-${ad.post_owner}_${ad.post_id}`
            }
        })
    }

    _unpackAutomates = (automates) => {
        return automates.map((automate) => {
            return {
                automateId: automate.id,
                campaignId: automate.campaign.campaign_id,
                cover: automate.campaign.cover_url,
                campaign: automate.campaign.campaign_name,
                startValue: _startValue_str_from_int(automate.start),
                stopValue: _stopValue_str_from_int(automate.finish),
                status: automate.status,
                type: _type_str_from_type_int(automate.type),
                count: _count_from_automate(automate),
                vtr: `${(_VTR_from_automate(automate) * 100).toFixed(2)}%` ,
                targetValue: automate.target_cost,
                realValue: _realValue_from_automate(automate),
                reach: automate.campaign.reach,
                spent: automate.campaign.spent.toFixed(2),
                cpm: automate.campaign.cpm.toFixed(2),
                createDate: _date_str_from_param(automate.create_date),
                finishDate: _date_str_from_param(automate.finish_date),
            }
        })
    }

}