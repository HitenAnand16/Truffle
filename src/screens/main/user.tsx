import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const user = () => {
  return (
     <SafeAreaView
         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
       >
         <Text>User</Text>
       </SafeAreaView>
  )
}

export default user