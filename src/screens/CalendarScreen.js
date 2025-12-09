import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components';

const { width: screenWidth } = Dimensions.get('window');

const CalendarScreen = ({ navigation }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Para visualizar o calendário completo, precisamos de permissão para acessá-lo.',
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

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const events = await Calendar.getEventsAsync(
        [unijuiCalendar.id],
        startOfMonth,
        endOfMonth
      );

      events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setCalendarEvents(events);

    } catch (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao carregar o calendário. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    const eventDate = new Date(date);
    const hours = eventDate.getHours().toString().padStart(2, '0');
    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateFull = (date) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    const firstMonday = new Date(firstDayOfMonth);
    const firstDayWeek = firstDayOfMonth.getDay();
    const daysToSubtract = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
    firstMonday.setDate(firstDayOfMonth.getDate() - daysToSubtract);

    const days = [];
    const current = new Date(firstMonday);

    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 5; day++) {
        const date = new Date(current);
        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === new Date().toDateString();
        const events = getEventsForDate(date);

        days.push({
          date: date,
          day: date.getDate(),
          isCurrentMonth,
          isToday,
          events: events,
          hasEvents: events.length > 0
        });

        current.setDate(current.getDate() + 1);
      }
      current.setDate(current.getDate() + 2);
    }

    return days;
  };

  const handleDatePress = (dayInfo) => {
    if (dayInfo.hasEvents) {
      setSelectedDateEvents(dayInfo.events);
      setSelectedDateInfo(dayInfo);
      setModalVisible(true);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Calendário"
        leftIcon="arrow-back"
        rightIcon="refresh"
        onLeftPress={() => navigation.goBack()}
        onRightPress={fetchCalendarEvents}
        showLeftIcon={true}
        showRightIcon={true}
      />

      {/* Navigation do mês */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={() => navigateMonth(-1)}>
          <MaterialIcons name="chevron-left" size={30} color="#01458E" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
          })}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth(1)}>
          <MaterialIcons name="chevron-right" size={30} color="#01458E" />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#01458E" />
          <Text style={styles.loadingText}>Carregando eventos...</Text>
        </View>
      ) : (
        <View style={styles.calendarContainer}>
          {/* Header dos dias da semana */}
          <View style={styles.calendarWrapper}>
            <View style={styles.weekHeader}>
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map(day => (
                <View key={day} style={styles.weekHeaderDay}>
                  <Text style={styles.weekHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Grid do calendário */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((dayInfo, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !dayInfo.isCurrentMonth && styles.dayNotCurrentMonth,
                    dayInfo.isToday && styles.dayToday,
                    dayInfo.hasEvents && styles.dayWithEvents
                  ]}
                  onPress={() => handleDatePress(dayInfo)}
                  disabled={!dayInfo.hasEvents}
                >
                  <Text style={[
                    styles.dayNumber,
                    !dayInfo.isCurrentMonth && styles.dayNumberNotCurrentMonth,
                    dayInfo.isToday && styles.dayNumberToday,
                    dayInfo.hasEvents && styles.dayNumberWithEvents
                  ]}>
                    {dayInfo.day}
                  </Text>
                  {dayInfo.hasEvents && (
                    <View style={styles.eventsIndicator}>
                      <Text style={styles.eventsCount}>
                        {dayInfo.events.length} evento{dayInfo.events.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Modal de detalhes do evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDateInfo && formatDateFull(selectedDateInfo.date)}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedDateEvents.map((event, index) => (
                <View key={index} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </Text>
                  </View>

                  {event.location && (
                    <View style={styles.eventDetail}>
                      <MaterialIcons name="place" size={16} color="#666" />
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                  )}

                  {event.notes && (
                    <View style={styles.eventDetail}>
                      <MaterialIcons name="description" size={16} color="#666" />
                      <Text style={styles.eventNotes}>{event.notes}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 1,
  },

  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01458E',
    textTransform: 'capitalize',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },

  calendarContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    marginVertical: 10,
    width: '100%',
    maxWidth: screenWidth - 30,
  },

  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  weekHeaderDay: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  weekHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#01458E',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: (screenWidth - 30) / 5,
    height: 80,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: '#e9ecef',
    borderBottomColor: '#e9ecef',
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  dayNotCurrentMonth: {
    backgroundColor: '#f8f9fa',
  },

  dayToday: {
    backgroundColor: '#e3f2fd',
  },

  dayWithEvents: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 3,
    borderLeftColor: '#01458E',
  },

  dayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  dayNumberNotCurrentMonth: {
    color: '#ccc',
  },

  dayNumberToday: {
    color: '#01458E',
  },

  dayNumberWithEvents: {
    color: '#01458E',
  },

  eventsIndicator: {
    backgroundColor: 'rgba(1, 69, 142, 0.1)',
    borderRadius: 4,
    padding: 2,
  },

  eventsCount: {
    fontSize: 10,
    color: '#01458E',
    fontWeight: '500',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01458E',
    flex: 1,
    textTransform: 'capitalize',
  },

  modalCloseButton: {
    padding: 8,
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  eventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#01458E',
  },

  eventHeader: {
    marginBottom: 8,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  eventTime: {
    fontSize: 14,
    color: '#01458E',
    fontWeight: '600',
  },

  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },

  eventNotes: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
});

export default CalendarScreen;
