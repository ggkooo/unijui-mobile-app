import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { MaterialIcons } from '@expo/vector-icons';

const WeeklyCalendar = ({ navigation }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('agora');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    console.log('Atualizando agenda...');
    setIsLoading(true);
    await fetchCalendarEvents();
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const handlePermissions = async () => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();

      if (status === 'granted') {
        Alert.alert(
          'Permissões Ativas',
          'O aplicativo já possui as permissões necessárias para acessar seu calendário.',
          [{ text: 'OK' }]
        );
        return;
      }

      const { status: newStatus } = await Calendar.requestCalendarPermissionsAsync();

      if (newStatus === 'granted') {
        Alert.alert(
          'Permissões Concedidas',
          'Agora o aplicativo pode acessar seu calendário. Toque em atualizar para sincronizar seus compromissos.',
          [
            {
              text: 'Atualizar Agora',
              onPress: handleRefresh
            },
            {
              text: 'OK'
            }
          ]
        );
      } else {
        Alert.alert(
          'Permissão Negada',
          'Para sincronizar com seu calendário, é necessário conceder permissão nas configurações do dispositivo.',
          [
            {
              text: 'Configurações',
              onPress: () => {
                // No futuro, pode abrir as configurações do app
                console.log('Abrir configurações do sistema');
              }
            },
            {
              text: 'Cancelar'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao verificar as permissões. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleInfo = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Calendar');
    } else {
      console.log('Navigation não disponível');
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Para sincronizar com seu calendário, precisamos de permissão para acessá-lo.',
          [{ text: 'OK' }]
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

      const unijuiCalendar = calendars.find(
        cal => cal.title.toLowerCase().includes('unijuí') ||
               cal.title.toLowerCase().includes('unijui')
      );

      if (!unijuiCalendar) {
        Alert.alert(
          'Calendário não encontrado',
          'Não foi possível encontrar o calendário "UNIJUÍ". Verifique se você possui um calendário com esse nome.',
          [{ text: 'OK' }]
        );
        return;
      }

      const today = new Date();
      const currentDay = today.getDay();
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - currentDay + 1);
      mondayDate.setHours(0, 0, 0, 0);

      const fridayDate = new Date(mondayDate);
      fridayDate.setDate(mondayDate.getDate() + 4);
      fridayDate.setHours(23, 59, 59, 999);

      const events = await Calendar.getEventsAsync(
        [unijuiCalendar.id],
        mondayDate,
        fridayDate
      );

      setCalendarEvents(events);
      console.log('Eventos encontrados:', events.length);

    } catch (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao sincronizar com o calendário. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const calculateTimeAgo = (updateTime) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - updateTime) / 1000);

    if (diffInSeconds < 60) {
      return diffInSeconds === 0 ? 'agora' : `${diffInSeconds} segundo${diffInSeconds !== 1 ? 's' : ''} atrás`;
    } else {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''} atrás`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(lastUpdate));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const getWeeklySchedule = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const weekData = [];

    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      date.setHours(0, 0, 0, 0);

      const dayEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      if (dayEvents.length > 0) {
        dayEvents.forEach(event => {
          const eventStartDate = new Date(event.startDate);
          const hours = eventStartDate.getHours().toString().padStart(2, '0');
          const minutes = eventStartDate.getMinutes().toString().padStart(2, '0');

          weekData.push({
            dayName: dayNames[i],
            day: date.getDate(),
            month: monthNames[date.getMonth()],
            isToday: i === currentDay,
            subject: event.title,
            time: `${hours}:${minutes}`,
            hasEvent: true,
          });
        });
      } else {
        weekData.push({
          dayName: dayNames[i],
          day: date.getDate(),
          month: monthNames[date.getMonth()],
          isToday: i === currentDay,
          subject: null,
          time: null,
          hasEvent: false,
        });
      }
    }

    return weekData;
  };

  const weekData = getWeeklySchedule();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handlePermissions}
          >
            <MaterialIcons name="lock" size={20} color="#01458E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={handleInfo}
          >
            <MaterialIcons name="info" size={20} color="#01458E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.refreshButton, isLoading && styles.loadingButton]}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <MaterialIcons
              name="refresh"
              size={20}
              color={isLoading ? '#888' : '#01458E'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.calendar}>
        {weekData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.dayRow,
              item.isToday && styles.todayRow
            ]}
          >
            <View style={styles.dateColumn}>
              <Text style={[
                styles.dayNumber,
                item.isToday && styles.todayDayNumber
              ]}>
                {item.day}
              </Text>
              <Text style={[
                styles.monthText,
                item.isToday && styles.todayMonthText
              ]}>
                {item.month}
              </Text>
            </View>

            <View style={styles.timeColumn}>
              {item.hasEvent ? (
                <>
                  <Text style={[
                    styles.timeText,
                    item.isToday && styles.todayTimeText
                  ]}>
                    {item.time}
                  </Text>
                  <Text style={[
                    styles.dayNameText,
                    item.isToday && styles.todayDayNameText
                  ]}>
                    {item.dayName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[
                    styles.noTimeText,
                    item.isToday && styles.todayNoTimeText
                  ]}>
                    --:--
                  </Text>
                  <Text style={[
                    styles.dayNameText,
                    item.isToday && styles.todayDayNameText
                  ]}>
                    {item.dayName}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.subjectColumn}>
              {item.hasEvent ? (
                <Text
                  style={[
                    styles.subjectText,
                    item.isToday && styles.todaySubjectText
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.subject}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.noSubjectText,
                    item.isToday && styles.todayNoSubjectText
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Sem compromissos
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.lastUpdateText}>
        Última atualização em: {timeAgo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
  },

  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  permissionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  infoButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  refreshButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  loadingButton: {
    opacity: 0.6,
  },

  calendar: {
    gap: 10,
  },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: '#01458E',
    minHeight: 70,
  },

  todayRow: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#ff5722',
  },

  dateColumn: {
    alignItems: 'center',
    width: 45,
  },

  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 18,
  },

  todayDayNumber: {
    color: '#01458E',
  },

  monthText: {
    fontSize: 8,
    color: '#666',
    fontWeight: '500',
    textTransform: 'lowercase',
  },

  todayMonthText: {
    color: '#01458E',
    fontWeight: 'bold',
  },

  timeColumn: {
    alignItems: 'center',
    width: 75,
    marginLeft: 15,
  },

  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 14,
  },

  todayTimeText: {
    color: '#01458E',
  },

  noTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
    lineHeight: 14,
  },

  todayNoTimeText: {
    color: '#b3d9ff',
  },

  dayNameText: {
    fontSize: 9,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginTop: 1,
  },

  todayDayNameText: {
    color: '#01458E',
    fontWeight: 'bold',
  },

  subjectColumn: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    minHeight: 40,
  },

  subjectText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'left',
  },

  todaySubjectText: {
    color: '#01458E',
  },

  noSubjectText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },

  todayNoSubjectText: {
    color: '#7db8e8',
  },

  lastUpdateText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});

export default WeeklyCalendar;
