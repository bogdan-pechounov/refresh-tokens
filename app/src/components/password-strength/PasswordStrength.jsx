import React from 'react'
import zxcvbn from 'zxcvbn'

function PasswordStrength({ password }) {
  if (!password) return
  const strength = zxcvbn(password)
  const score = strength.score //0 to 4
  const color = ['gray', 'red', 'yellow', 'yellowgreen', 'limegreen'][score]
  const label = ['very weak', 'weak', 'decent', 'strong', 'very strong'][score]
  const width = `${score * 25}%`
  const height = '5px'
  return (
    <>
      <div className='progress' style={{ height }}>
        <div
          className='progress-bar'
          style={{ backgroundColor: color, width, height }}
        ></div>
      </div>
      <p style={{ textTransform: 'capitalize', color }}>{label}</p>
    </>
  )
}

export default PasswordStrength
