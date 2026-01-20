import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Sidebar from '../components/Sidebar';

const AcademicScreen = ({ navigation }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('Ciência da Computação');
  const [selectedSemester, setSelectedSemester] = useState('2026/1');

  const handleMenuPress = () => setIsSidebarVisible(true);
  const closeSidebar = () => setIsSidebarVisible(false);

  const handleProgressPress = () => {
    navigation.navigate('CourseProgress');
  };

  const ProgressIcon = () => {
    return (
      <TouchableOpacity
        style={styles.progressIconContainer}
        onPress={handleProgressPress}
        activeOpacity={0.7}
      >
        <View style={styles.progressIconBackground}>
          <Ionicons name="analytics-outline" size={20} color="#01458E" />
        </View>
        <View style={styles.progressIconDot}>
          <View style={styles.progressDotInner} />
        </View>
      </TouchableOpacity>
    );
  };

  // Dados de cursos disponíveis
  const courses = [
    'Ciência da Computação',
    'Engenharia de Software',
    'Sistemas de Informação',
    'Análise e Desenvolvimento de Sistemas',
    'Engenharia Civil',
    'Administração',
    'Direito',
    'Medicina',
    'Enfermagem',
  ];

  // Dados de semestres disponíveis
  const semesters = [
    '2026/1',
    '2025/2',
    '2025/1',
    '2024/2',
    '2024/1',
    '2023/2',
    '2023/1',
  ];

  // Dados acadêmicos mockados
  const academicData = {
    student: {
      name: 'GIORDANO BRUNO BIASI BERWIG',
      registration: '202012345',
      course: 'Ciência da Computação',
      period: '7º Semestre',
      status: 'Ativo',
      completionPercentage: 75,
    },
    currentSemester: {
      semester: '2026/1',
      subjects: [
        {
          id: 1,
          name: 'Inteligência Artificial',
          code: 'CC401',
          credits: 4,
          grade: 8.5,
          attendance: 92,
          status: 'Aprovado',
        },
        {
          id: 2,
          name: 'Engenharia de Software II',
          code: 'CC402',
          credits: 4,
          grade: 9.0,
          attendance: 88,
          status: 'Aprovado',
        },
        {
          id: 3,
          name: 'Trabalho de Conclusão I',
          code: 'CC403',
          credits: 2,
          grade: null,
          attendance: 95,
          status: 'Cursando',
        },
        {
          id: 4,
          name: 'Sistemas Distribuídos',
          code: 'CC404',
          credits: 4,
          grade: null,
          attendance: 85,
          status: 'Cursando',
        },
      ],
    },
    summary: {
      totalCredits: 240,
      completedCredits: 180,
      currentCredits: 14,
      generalAverage: 8.2,
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado':
        return '#4CAF50';
      case 'Cursando':
        return '#FF9800';
      case 'Reprovado':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const CustomSelect = ({ label, value, options, onSelect, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <View style={styles.selectContainer}>
        <Text style={styles.selectLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <View style={styles.selectButtonContent}>
            <Ionicons name={icon} size={20} color="#01458E" style={styles.selectIcon} />
            <Text style={styles.selectValue}>{value}</Text>
            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  option === value && styles.selectedOption
                ]}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  option === value && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {option === value && (
                  <Ionicons name="checkmark" size={20} color="#01458E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderProgressCircle = (percentage) => {
    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircleBackground}>
          <View style={[styles.progressCircleFill, {
            transform: [{ rotate: `${(percentage * 3.6)}deg` }]
          }]} />
          <View style={styles.progressCircleInner}>
            <Text style={styles.progressPercentage}>{percentage}%</Text>
            <Text style={styles.progressLabel}>Concluído</Text>
          </View>
        </View>
      </View>
    );
  };

  const SubjectCard = ({ subject }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Text style={styles.subjectCode}>{subject.code} • {subject.credits} créditos</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subject.status) }]}>
          <Text style={styles.statusText}>{subject.status}</Text>
        </View>
      </View>

      <View style={styles.subjectDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Nota:</Text>
          <Text style={styles.detailValue}>
            {subject.grade !== null ? subject.grade.toFixed(1) : '--'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Frequência:</Text>
          <Text style={[
            styles.detailValue,
            { color: subject.attendance >= 75 ? '#4CAF50' : '#F44336' }
          ]}>
            {subject.attendance}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#01458E" translucent={false} />

      {/* Header Customizado */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Acadêmico</Text>

          <ProgressIcon />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seletores de Curso e Semestre */}
        <View style={styles.selectorsSection}>
          <CustomSelect
            label="Curso"
            value={selectedCourse}
            options={courses}
            onSelect={setSelectedCourse}
            icon="school-outline"
          />

          <CustomSelect
            label="Semestre"
            value={selectedSemester}
            options={semesters}
            onSelect={setSelectedSemester}
            icon="calendar-outline"
          />
        </View>

        {/* Semestre Atual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Semestre Selecionado - {selectedSemester}
          </Text>
          <View style={styles.subjectsContainer}>
            {academicData.currentSemester.subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </View>
        </View>

        {/* Resumo do Semestre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Semestre</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Ionicons name="book-outline" size={20} color="#01458E" />
              <Text style={styles.summaryLabel}>Disciplinas:</Text>
              <Text style={styles.summaryValue}>{academicData.currentSemester.subjects.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="trophy-outline" size={20} color="#01458E" />
              <Text style={styles.summaryLabel}>Créditos:</Text>
              <Text style={styles.summaryValue}>{academicData.summary.currentCredits}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-done-outline" size={20} color="#01458E" />
              <Text style={styles.summaryLabel}>Aprovadas:</Text>
              <Text style={styles.summaryValue}>
                {academicData.currentSemester.subjects.filter(s => s.status === 'Aprovado').length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={closeSidebar}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#01458E',
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  headerButton: {
    padding: 8,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  progressIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressIconBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  progressIconDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#01458E',
  },
  progressDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  selectorsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 16,
  },
  selectContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectIcon: {
    marginRight: 12,
  },
  selectValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#01458E',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  subjectsContainer: {
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  subjectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01458E',
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  progressCircleBackground: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressCircleFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#01458E',
    borderRadius: 50,
    transformOrigin: 'center',
  },
  progressCircleInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 40,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#01458E',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default AcademicScreen;
