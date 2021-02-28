import React from 'react'
import { View, StyleSheet } from 'react-native'
import SectionItem from './SectionItem'

const users = {
    diamond: {
        I: {
            users:
            [   {
                    name: 'Arnaud Magnan',
                    points: 13500
                },
                {
                    name: 'Patrick Mulcare',
                    points: 13480
                },
                {
                    name: 'Carsten Vissering',
                    points: 13400
                }
            ]
        },
        II: {
            users:
            [   {
                    name: 'Maxence Bouvier',
                    points: 12500
                },
                {
                    name: 'Mario Konigsperger',
                    points: 12300
                }
            ]
        },
        III: {
            users:
            [   {
                    name: 'Billy Monjay',
                    points: 11500
                },
                {
                    name: 'Thomas Reed',
                    points: 11200
                }
            ]
        }
    },
    platinum: {
        I: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        II: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        III: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        }
    },
    gold: {
        I: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        II: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        III: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        }
    },
    silver: {
        I: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        II: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        III: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        }
    },
    bronze: {
        I: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        II: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        },
        III: {
            users:
            [   {
                    name: 'Robin Deschaintres',
                    points: 10100
                },
                {
                    name: 'Thomas Rabeisen',
                    points: 10050
                }
            ]
        }
    }
}

export default class Sections extends React.Component {
    render() {
        var count = 0
        return (
            <View>
                <SectionItem title='Diamond I' users={users.diamond.I.users} level='I'/>
                <SectionItem title='Diamond II' users={users.diamond.II.users} level='II'/>
                <SectionItem title='Diamond III' users={users.diamond.III.users} level='III'/>
                <SectionItem title='Platinum I' users={users.platinum.I.users} level='I'/>
                <SectionItem title='Platinum II' users={users.platinum.II.users} level='II'/>
                <SectionItem title='Platinum III' users={users.platinum.III.users} level='III'/>
                <SectionItem title='Gold I' users={users.gold.I.users} level='I'/>
                <SectionItem title='Gold II' users={users.gold.II.users} level='II'/>
                <SectionItem title='Gold III' users={users.gold.III.users} level='III'/>
                <SectionItem title='Silver I' users={users.silver.I.users} level='I'/>
                <SectionItem title='Silver II' users={users.silver.II.users} level='II'/>
                <SectionItem title='Silver III' users={users.silver.III.users} level='III'/>
                <SectionItem title='Bronze I' users={users.bronze.I.users} level='I'/>
                <SectionItem title='Bronze II' users={users.bronze.II.users} level='II'/>
                <SectionItem title='Bronze III' users={users.bronze.II.users} level='III'/>
            </View>
        )
    }
}