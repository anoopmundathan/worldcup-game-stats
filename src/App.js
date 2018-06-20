import React, { Component } from 'react'
import './css/App.css'
import './css/flag-css.min.css'
import alex from './avatars/alex.png'
import harriet from './avatars/harriet.png'
import james from './avatars/james.png'
import juliet from './avatars/juliet.png'
import andrei from './avatars/andrei.png'
import richard from './avatars/richard.png'
import anne from './avatars/anne.png'
import rob from './avatars/rob.png'
import anoop from './avatars/anoop.png'
import russell from './avatars/russell.png'
import don from './avatars/don.png'
import vijay from './avatars/vijay.png'
import fraser from './avatars/fraser.png'
import ed from './avatars/ed.png'
import orlando from './avatars/orlando.png'
import philip from './avatars/philip.png'
import raj from './avatars/raj.png'
import imogen from './avatars/imogen.png'



const avatars = {
  alex,
  harriet,
  james,
  juliet,
  andrei,
  richard,
  anne,
  rob,
  anoop,
  russell,
  don,
  vijay,
  fraser,
  ed,
  orlando,
  philip,
  raj,
  imogen,
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pastMatchesData: [],
      currentMatchesData: [],
      futureMatchesData: []
    }

    // this.internal = {
    //   kristine: ['BRA', 'DEN', 'SRB'],
    //   tej: ['ARG', 'ENG', 'POL'],
    //   nicky: ['GER', 'KSA', 'KOR'],
    //   mark: ['AUS', 'ISL', 'JPN'],
    //   mike: ['ESP', 'SWE', 'BEL'],
    //   denis: ['EGY', 'POR', 'TUN'],
    //   rob: ['CRO', 'RUS', 'PER'],
    //   carl: ['CRC', 'FRA', 'MAR'],
    //   richard: ['PAN', 'SEN', 'URU'],
    //   david: ['SUI', 'MEX', 'COL'],
    //   ian: ['IRN', 'NGA']
    // }
    this.internal = {
      anne: ['RUS'],
      philip: ['KSA', 'BEL'],
      juliet: ['EGY', 'CRC', 'SUI', 'MEX'],
      chris: ['URU'],
      imogen: ['POR'],
      russell: ['ESP'],
      vijay: ['MAR'],
      orlando: ['IRN'],
      harriet: ['DEN'],
      jack: ['FRA', 'JPN'],
      fraser: ['PER', 'NGA'],
      alex: ['AUS'],
      don: ['ARG', 'CRO'],
      james: ['ISL', 'COL'],
      ed: ['SRB'],
      matt: ['BRA'],
      rob: ['GER'],
      raj: ['SWE'],
      richard: ['KOR', 'ENG'],
      anoop: ['PAN', 'SEN'],
      andrei: ['TUN'],
      louis: ['POL'],
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

    return avatar 
      ? <img src={avatar} alt={staffName} className='staff' /> 
      : <div className='staff'><h4 style={{ color: '#b8222f' }}>{staffName ? staffName.toUpperCase() : ""}</h4></div>
  }

  displayMatch (match, index, noScore = false) {
    return (
      <div key={index} className="aMatch">
        <div className="score" style={ { 
            
            width: '90%', 
            margin: 'auto' }}>
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
        <h1>FIFA World Cup 2018 live scores </h1>
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
