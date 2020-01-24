import React from 'react'

import Box from '@material-ui/core/Box'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'

export default function PageHeader() {
  return (
    <Box position="fixed" top="0" textAlign="center" width="100%" padding={1}>
      <LocalFloristIcon />
    </Box>
  )
}
