import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiValues = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {vaccinationData: {}, apiStatus: apiValues.initial}

  componentDidMount() {
    this.getEachData()
  }

  getEachData = async () => {
    this.setState({apiStatus: apiValues.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const responseData = await response.json()
    if (response.ok === true) {
      const updatedData = {
        last7DaysVaccination: responseData.last_7_days_vaccination,
        VaccinationByAges: responseData.vaccination_by_age,
        VaccinationByGenders: responseData.vaccination_by_gender,
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiValues.success,
      })
    } else {
      this.setState({apiStatus: apiValues.failure})
    }
  }

  renderPyCharts = () => {
    const {vaccinationData} = this.state
    const {
      last7DaysVaccination,
      VaccinationByAges,
      VaccinationByGenders,
    } = vaccinationData

    return (
      <>
        <VaccinationCoverage data={last7DaysVaccination} />
        <VaccinationByGender genderData={VaccinationByGenders} />
        <VaccinationByAge ageData={VaccinationByAges} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" heights={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failureImg"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiValues.success:
        return this.renderPyCharts()
      case apiValues.failure:
        return this.renderFailureView()
      case apiValues.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin">
        <nav className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-head">Co-WIN</h1>
        </nav>
        <h1 className="head">CoWIN Vaccination in india</h1>
        <div className="charts">{this.renderResultView()}</div>
      </div>
    )
  }
}

export default CowinDashboard
