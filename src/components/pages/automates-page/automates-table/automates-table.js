import React from 'react';
import ApiService from "../../../../services/api-service";
import Spinner from "../../../spinner";
import AutomatesTableView from "../../../tables/automates-table-view";


class AutomatesTable extends React.Component {

    state = {
        loading: true,
        automates: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateAutomates()
    }

    updateAutomates = () => {
        this.api.getAutomates().then(this.onAutomatesLoaded)
    }

    onAutomatesLoaded = (automates) => {
        if (typeof automates !== 'undefined') {
            this.setState({
                automates: automates,
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

    handleStop = (automateId) => {
        this.setState({automateIsStopping: true})
        this.api.stopAutomate(automateId).then(this.updateAutomates)
    }

    render() {
        const {loading, hasData, automates} = this.state
        const table = hasData ? <AutomatesTableView rows={automates} handleStop={this.handleStop} /> : null
        const spinner = loading ? <Spinner /> : null
        const error = hasData ? null : spinner ? null : <h2>У тебя еще нет автоматизаций</h2>

        return (
            <div className='automates-page'>
                {spinner}
                {table}
                {error}
            </div>
        )
    }

}


export default AutomatesTable