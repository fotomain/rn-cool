

// npm install react-native-receive-sharing-intent --save

// cd C:\Users\Jurijs_LDC\.android\avd
// C:\SDK\tools\emulator -avd Pixel_8_API_35
// C:\SDK\tools\adb -e reboot
// npm start
// npm run android

// ====================== DOC sqline https://sdk.dronahq.com/en/latest/developer/api-device-sqlite.html
// ======================
// taskkill /F /IM node.exe
// npx react-native start --reset-cache
// C:\SDK\platform-tools\adb -e reboot

import React, {type PropsWithChildren, useEffect} from 'react';
import {
    Button, FlatList,
    Platform,
    Alert,
} from 'react-native'

// npm install react-native-receive-sharing-intent --save
// import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {NativeModules} from 'react-native';
const {Linking} = NativeModules

import { useCallback, useState } from 'react';

import SQLite from 'react-native-sqlite-storage'

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


SQLite.DEBUG(true)
SQLite.enablePromise(true)


//
// ===========================
// ===========================
// ===========================
// ===========================
// ===========================



const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};


const useInitialURL = () => {
    const [url, setUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();

            alert('initialUrl === '+initialUrl)
            console.log('initialUrl === '+initialUrl)

            // The setTimeout is just for testing purpose
            setTimeout(() => {
                setUrl(initialUrl);
                setProcessing(false);
            }, 1000);
        };

        getUrlAsync();
    }, []);

    return {url, processing};
};


// sss1
const App = () => {

  const {url: initialUrl, processing} = useInitialURL();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


    const tableName = 'todoData11';

    const [state, setState] =useState({
        db:null,
        is_ready_sqlite_db:false,
        colorNew:'brown',
        data_items:[],
        batchSuccess:false,
        received_data:{},
    })

    useEffect(() => {
        var colors = ['red', 'green', 'blue', 'orange', 'darkcyan'];
        setState((prevState) => {return {...prevState,
                colorNew:colors[Math.floor(Math.random() * colors.length)]
        }})


    }, []);
    useEffect(() => {

        if(!state.is_ready_sqlite_db) {
            const do_ = async () => {
                const db = await SQLite.openDatabase({name: 'my.db', location: 'default'});

                setState((prevState:any) => {return {...prevState,
                        db: db,
                        is_ready_sqlite_db: true,
                    }})

            }
            do_()
        }    }, [state.is_ready_sqlite_db]);


//     const db = SQLite.openDatabase(
//       {
//         name: 'TestDB.db',
//         location: 'default',
// //         createFromLocation: '~www/TestDB.db',
//       },
//       () => {
//           //alert('openDatabase OK');
//           // is_ready_sqlite_db=true
//           // setState((prevState)=>{return {...prevState,
//           //       is_ready_sqlite_db:true,
//           //     }
//           // })
//       },
//       (error:any) => {
//         console.log('=== c1 error', error);
//         alert('openDatabase error');
//       }
//     );



  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />

        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

            <Text>
                {processing
                    ? 'Processing the initial url from a deep link'
                    : `The deep link is: ${initialUrl || 'None'}`}
            </Text>

            <Text>{JSON.stringify(state.received_data)}</Text>
            <Button title={'CREATE'}
                    onPress={()=>{
                        const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(
                         guid TEXT , value TEXT  
                        );`
                            const do_ = async () => {
                                if(state.db) {
                                    // @ts-ignore
                                    state.db.transaction((tx:any) => {
                                        tx.executeSql(
                                            createQuery,
                                            [],
                                            (tx:any, result:any) => {
                                                // alert(`Created createQuery!`);
                                            },
                                            (err:any) => {
                                                // alert(`NOT Created ERROR createQuery`);
                                            },
                                        );
                                    });


                                }
                            }
                            do_()
                        }

                    }
            />

            <Button title={'DELETE ALL'}
                    onPress={()=> {
                        const deleteQuery = `DELETE FROM ${tableName} `

                        if(state.db) {
                            // @ts-ignore
                            state.db.transaction((tx:any) => {
                                tx.executeSql(
                                    deleteQuery,
                                    [],
                                    (tx:any, result:any) => {
                                        // alert(`Deleted deleteQuery!`);

                                        setState((prevState:any) => {return {...prevState,
                                            data_items:[],
                                        }})

                                    },
                                    (err:any) => {
                                        // alert(`NOT Deleted ERROR deleteQuery`);
                                    },
                                );
                            });


                        }

                    }}
            />
            <Button title={'INSERT MANY'}
                    onPress={()=>{

                        const insertQuery =
                            `INSERT OR REPLACE INTO ${tableName}(guid, value) values` +
                            `( ${Math.random()}, ${Date.now()})`;

                        const do_ = async () => {
                            if(state.db) {


                                // @ts-ignore
                                state.db.transaction((tx:any) => {
                                    for (let i = 0; i < 5 ; i++) {
                                        tx.executeSql(
                                            insertQuery,
                                            [],
                                            (tx:any, result:any) => {
                                                // alert(`Inserted! insertQuery `);
                                            },
                                            (err:any) => {
                                                // alert(`NOT Insert ERROR insertQuery `);
                                            },
                                        );
                                    }
                                });

                            }}

                        do_()

                    }}
            />

            <Button title={'INSERT'}
                    onPress={()=>{

                        const insertQuery =
                            `INSERT OR REPLACE INTO ${tableName}(guid, value) values` +
                            `( ${Math.random()}, ${Date.now()})`;

                        const do_ = async () => {
                            if(state.db) {

                                // @ts-ignore
                                state.db.transaction((tx:any) => {
                                    tx.executeSql(
                                        insertQuery,
                                        [],
                                        (tx:any, result:any) => {
                                            // alert(`Inserted! insertQuery `);
                                        },
                                        (err:any) => {
                                            // alert(`NOT Insert ERROR insertQuery `);
                                        },
                                    );
                                });

                            }}

                        do_()

                    }}
            />

            <Button title={'INSERT BATCH'}
                    onPress={()=>{


                        const do_ = async () => {
                                if(state.db) {
                                    // const resInsert = await state.db.executeSql(insertQuery);

                                const batchInsertQuery=[
                                     [` INSERT OR REPLACE INTO ${tableName} (guid, value) values (${Math.random()},${Date.now()}) `],
                                     [` INSERT OR REPLACE INTO ${tableName} (guid, value) values (${Math.random()},${Date.now()}) `],
                                     [` INSERT OR REPLACE INTO ${tableName} (guid, value) values (${Math.random()},${Date.now()}) `]
                                    ]
                                // const batchInsertQuery=[
                                //      [` INSERT OR REPLACE INTO ${tableName} values (?,?) `,[Math.random(),Date.now()]],
                                //      [` INSERT OR REPLACE INTO ${tableName} values (?,?) `,[Math.random(),Date.now()]],
                                //      [` INSERT OR REPLACE INTO ${tableName} values (?,?) `,[Math.random(),Date.now()]]
                                //     ]

                                // @ts-ignore
                                state.db.sqlBatch(
                                    batchInsertQuery,
                                    [],
                                    function(tx:any, result:any) {
                                        //NOT WORK STABLE
                                        // alert(`Inserted! batchInsertQuery !!!`);
                                        setState((prevState) => {return {...prevState,
                                            batchSuccess:true,
                                        }})


                                    },
                                    (err:any) => {
                                        // alert(`ERROR NOT Insert batchInsertQuery `);
                                    },
                                ).then((res:any)=>{
                                    // alert(`BATCH FIFISHED!`);
                                })

                                }
                            }
                            do_()
                        }

                    }
            />

            <Button title={'SELECT'}
                    onPress={()=>{

                        async function _select(dbLocal:any, table: string, columns: String, conditions?: String) {
                            return new Promise<any>((resolve, reject) => {
                                dbLocal.transaction((tx:any) => {
//                                     alert('222 SELECT START ')
//                                     alert(JSON.stringify(state.db))
                                    tx.executeSql(`SELECT ${columns} FROM ${table}`, [], (undefined:any, results:any) => {
                                        resolve(results);
                                    }, reject);
                                });
                            });
                        };

                        const do_ = async () => {

                            const results = await  _select(state.db,tableName, ' * ')
                            if(results.rows.length > 0) {
                                // alert('444 results length '+JSON.stringify(results.rows.length))
//                                 alert('444 results item 0 '+JSON.stringify(results.rows.item(0)))

                                let final_items:any=[]
                                for (let i = 0; i < results.rows.length; i++) {
                                    final_items.push(results.rows.item(i))
                                }
                                setState((prevState) => {return {...prevState,
                                    data_items:final_items,
                                }})
                            } else {
                                // alert('000 no data from SELECT')
                            }

                        }

                        do_()


                    }}
            />
            <Section title="Moment 222">
                <Text style={{color:state.colorNew}}>{Date.now()}</Text>
            </Section>
          <Section title={"is_ready_sqlite_db 1 "}>
              <Text style={styles.highlight}>{JSON.stringify(state.is_ready_sqlite_db)}</Text>
          </Section>
          <Section title={"batchSuccess 1 "}>
              <Text style={styles.highlight}>{JSON.stringify(state.batchSuccess)}</Text>
          </Section>

            {(state.data_items.length===0)?<View><Text>NO Items</Text></View>:
                <FlatList
                    // https://reactnative.dev/docs/next/flatlist?language=typescript
                    data={state.data_items}
                    renderItem={(dataItem)=>{
                        const line = dataItem.item
                        return <View style={styles.lineContainerStyle}><Text>{JSON.stringify(line.guid)}</Text></View>
                    }}
                    keyExtractor={(item:any) => {
                        // alert(item.guid)
                        return item?.guid
                    }}
                />
            }

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  lineContainerStyle: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'lightgreen',
  },
});

export default App;

