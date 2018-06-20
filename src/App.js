import React, { Component } from 'react'
import './css/App.css'
import './css/flag-css.min.css'
import kristine from './avatars/kristine.png'
import tej from './avatars/tej.png'
import nicky from './avatars/nicky.png'
import mark from './avatars/mark.png'
import mike from './avatars/mike.png'
import denis from './avatars/denis.png'
import rob from './avatars/rob.png'
import carl from './avatars/carl.png'
import richard from './avatars/richard.png'
import david from './avatars/david.png'
import ian from './avatars/ian.png'

const avatars = {
  kristine: kristine,
  tej: tej,
  nicky: nicky,
  mark: mark,
  mike: mike,
  denis: denis,
  rob: rob,
  carl: carl,
  richard: richard,
  david: david,
  ian: ian
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pastMatchesData: [],
      currentMatchesData: [],
      futureMatchesData: []
    }

    this.internal = {
      kristine: ['BRA', 'DEN', 'SRB'],
      tej: ['ARG', 'ENG', 'POL'],
      nicky: ['GER', 'KSA', 'KOR'],
      mark: ['AUS', 'ISL', 'JPN'],
      mike: ['ESP', 'SWE', 'BEL'],
      denis: ['EGY', 'POR', 'TUN'],
      rob: ['CRO', 'RUS', 'PER'],
      carl: ['CRC', 'FRA', 'MAR'],
      richard: ['PAN', 'SEN', 'URU'],
      david: ['SUI', 'MEX', 'COL'],
      ian: ['IRN', 'NGA']
    }
  }

  componentDidMount () {
    this.getMatchData()
    setInterval(() => {
      this.getMatchData()
    }, 15000)
  }

  getMatchData () {
    const myHeaders = new Headers()
    myHeaders.set('Cache-Control', 'no-cache')
    myHeaders.set('Pragma', 'no-cache')
    myHeaders.set('Expires', '0')

    window.fetch('http://worldcup.sfg.io/matches', {method: 'GET', headers: myHeaders}).then(res => {
      if (res.status !== 200) {
        console.error(res)
        console.error('Matches datasource responded with an non-200 status code.')
        return
      }
      
      res.json().then(data => {

        const pastMatches = data.reduce((matches, match) => {
          if (match.status === 'completed') matches.push(match)
          return matches
        }, []);

        this.setMatches(pastMatches, 'pastMatchesData')

        const currentMatches = data.reduce((matches, match) => {
          if (match.status === 'in progress') matches.push(match)
          return matches
        }, [])


        this.setMatches(currentMatches, 'currentMatchesData')

        const futureMatches = data.reduce((matches, match) => {
          if (match.status === 'future') matches.push(match)
          return matches
        }, [])

        this.setMatches(futureMatches, 'futureMatchesData')

      })
    }).catch(err => {
      console.error(err)
    })
  }

  setMatches (matches, stateKey) {
    matches.sort((a, b) => {
      const keyA = (new Date(a.datetime)).getTime()
      const keyB = (new Date(b.datetime)).getTime()
      return keyA - keyB
    })

    this.setState({
      [stateKey]: matches.reverse()
    })
  }

  staff (country) {
    let avatar, staffName
    Object.keys(this.internal).forEach(name => {
      if (this.internal[name].indexOf(country) > -1) {
        avatar = avatars[name]
        staffName = name
      }
    })
    return <img src={avatar} alt={staffName} className='staff' />
  }

  displayMatch (match, index, noScore = false) {
    return (
      <div key={index} className="aMatch">
        <div className="score">
          <div>{this.staff(match.home_team.code)}<span className={`flag flag-2x flag-fifa-${match.home_team.code.toLowerCase()}`}></span>{match.home_team.country}</div>
          {noScore && <div>&nbsp;</div>}
          {!noScore && <div>{match.home_team.goals}-{match.away_team.goals}</div>}
          <div>{this.staff(match.away_team.code)}<span className={`flag flag-2x flag-fifa-${match.away_team.code.toLowerCase()}`}></span>{match.away_team.country}</div>
        </div>
        {!noScore && <p><strong>Time elapsed:</strong> {match.time === 'half-time' ? 'Half time' : match.time}</p>}
        {noScore && <p><strong>Kick-off date and time:</strong> {(new Date(match.datetime)).toLocaleDateString()} {(new Date(match.datetime)).toLocaleTimeString()}</p>}
        <p><strong>Location:</strong> {match.location} - {match.venue}</p>
      </div>
    )
  }

  render() {
    console.log("future", this.state.futureMatchesData);
    return (
      <div className="App">
        <h1>FIFA World Cup 2018 live scores</h1>
        {this.state.futureMatchesData.length > 0 && <h2>Next match</h2>}
        {this.state.futureMatchesData.length > 0 && this.displayMatch(this.state.futureMatchesData[this.state.futureMatchesData.length-1], 0, true)}
        {this.state.currentMatchesData.length > 0 && <h2>Matches in progress</h2>}
        {this.state.currentMatchesData.map((match, index) => {
          return this.displayMatch(match, index)
        })}
        {this.state.pastMatchesData.length > 0 && <h2>Past matches</h2>}
        {this.state.pastMatchesData.length > 0 && this.state.pastMatchesData.map((match, index) => {
          return this.displayMatch(match, index)
        })}
      </div>
    );
  }
}

export default App;
