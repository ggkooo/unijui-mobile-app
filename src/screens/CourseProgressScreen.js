import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width: screenWidth } = Dimensions.get('window');

const CourseProgressScreen = ({ navigation }) => {
  const shareCardRef = useRef();

  const handleShareProgress = () => {
    generateProgressImage();
  };

  const generateProgressImage = async () => {
    try {
      // Captura a tela do card de progresso
      const uri = await captureRef(shareCardRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      // Verifica se o compartilhamento está disponível
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartilhar meu progresso acadêmico',
        });
      } else {
        Alert.alert(
          'Compartilhamento não disponível',
          'O compartilhamento não está disponível neste dispositivo.'
        );
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      Alert.alert(
        'Erro',
        'Não foi possível gerar a imagem. Tente novamente.'
      );
    }
  };

  // Dados de progresso do curso
  const courseProgress = {
    course: 'Ciência da Computação',
    totalCredits: 240,
    completedCredits: 180,
    completionPercentage: 75,
    currentSemester: '7º Semestre',
    expectedGraduation: '2026/2',
    generalAverage: 8.2,
    subjects: {
      completed: 45,
      inProgress: 6,
      remaining: 12,
      total: 63,
    },
    periods: [
      { semester: '1º', credits: 24, completed: true, average: 7.8 },
      { semester: '2º', credits: 24, completed: true, average: 8.1 },
      { semester: '3º', credits: 28, completed: true, average: 8.3 },
      { semester: '4º', credits: 26, completed: true, average: 8.5 },
      { semester: '5º', credits: 30, completed: true, average: 8.0 },
      { semester: '6º', credits: 28, completed: true, average: 8.4 },
      { semester: '7º', credits: 20, completed: false, average: 8.7 },
      { semester: '8º', credits: 22, completed: false, average: null },
      { semester: '9º', credits: 18, completed: false, average: null },
      { semester: '10º', credits: 20, completed: false, average: null },
    ],
  };

  const CircularProgress = ({ percentage, size = 140 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.circularProgressContainer, { width: size, height: size }]}>
        {/* Container do círculo */}
        <View style={styles.progressCircleWrapper}>
          {/* Círculo de fundo (cinza) */}
          <View style={[styles.progressBackgroundCircle, {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: '#f0f0f0'
          }]} />

          {/* Círculo de progresso (azul) */}
          <View style={[styles.progressForegroundCircle, {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: '#01458E',
            borderRightColor: percentage >= 25 ? '#01458E' : 'transparent',
            borderBottomColor: percentage >= 50 ? '#01458E' : 'transparent',
            borderLeftColor: percentage >= 75 ? '#01458E' : 'transparent',
            transform: [{ rotate: '-90deg' }],
            position: 'absolute',
          }]} />

          {/* Máscara para percentagens não completas */}
          {percentage < 100 && (
            <View style={[styles.progressMask, {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderTopColor: percentage < 25 && percentage > 0 ? '#f0f0f0' : 'transparent',
              borderRightColor: percentage < 50 && percentage >= 25 ? '#f0f0f0' : 'transparent',
              borderBottomColor: percentage < 75 && percentage >= 50 ? '#f0f0f0' : 'transparent',
              borderLeftColor: percentage < 100 && percentage >= 75 ? '#f0f0f0' : 'transparent',
              transform: [{ rotate: `${-90 + (percentage * 3.6)}deg` }],
              position: 'absolute',
            }]} />
          )}

          {/* Círculo interno branco */}
          <View style={[styles.progressInnerCircle, {
            width: size - (strokeWidth * 2),
            height: size - (strokeWidth * 2),
            borderRadius: (size - (strokeWidth * 2)) / 2,
            backgroundColor: '#fff',
            position: 'absolute',
            top: strokeWidth,
            left: strokeWidth,
          }]} />

          {/* Texto central */}
          <View style={styles.progressTextContainer}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.percentageLabel}>Concluído</Text>
          </View>
        </View>
      </View>
    );
  };

  const StatCard = ({ icon, title, value, subtitle, color = '#01458E' }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const SemesterCard = ({ period, isCompleted, isInProgress }) => (
    <View style={[
      styles.semesterCard,
      isCompleted && styles.completedSemester,
      isInProgress && styles.inProgressSemester
    ]}>
      <View style={styles.semesterHeader}>
        <Text style={styles.semesterTitle}>{period.semester} Semestre</Text>
        <View style={styles.semesterStatus}>
          {isCompleted && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
          {isInProgress && <Ionicons name="time-outline" size={20} color="#FF9800" />}
          {!isCompleted && !isInProgress && <Ionicons name="ellipse-outline" size={20} color="#ccc" />}
        </View>
      </View>
      <View style={styles.semesterDetails}>
        <Text style={styles.semesterCredits}>{period.credits} créditos</Text>
        {period.average && (
          <Text style={styles.semesterAverage}>Média: {period.average.toFixed(1)}</Text>
        )}
      </View>
    </View>
  );

  const ShareCard = () => (
    <View ref={shareCardRef} style={styles.shareCard}>
      {/* Header do card de compartilhamento */}
      <View style={styles.shareHeader}>
        <View style={styles.shareLogoContainer}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.shareLogoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.shareTitle}>Progresso Acadêmico</Text>
      </View>

      {/* Círculo de progresso para compartilhamento */}
      <View style={styles.shareProgressContainer}>
        <CircularProgress percentage={courseProgress.completionPercentage} size={120} />
      </View>

      {/* ...existing code... */}
      {/* Informações do curso */}
      <View style={styles.shareCourseInfo}>
        <Text style={styles.shareCourseName}>{courseProgress.course}</Text>
        <Text style={styles.shareCourseDetails}>
          {courseProgress.completedCredits}/{courseProgress.totalCredits} créditos concluídos
        </Text>
        <Text style={styles.shareSemester}>
          {courseProgress.currentSemester} • Média: {courseProgress.generalAverage}
        </Text>
      </View>

      {/* Estatísticas resumidas */}
      <View style={styles.shareStats}>
        <View style={styles.shareStatItem}>
          <Text style={styles.shareStatNumber}>{courseProgress.subjects.completed}</Text>
          <Text style={styles.shareStatLabel}>Disciplinas</Text>
          <Text style={styles.shareStatLabel}>Concluídas</Text>
        </View>
        <View style={styles.shareStatItem}>
          <Text style={styles.shareStatNumber}>{courseProgress.generalAverage.toFixed(1)}</Text>
          <Text style={styles.shareStatLabel}>Média</Text>
          <Text style={styles.shareStatLabel}>Geral</Text>
        </View>
        <View style={styles.shareStatItem}>
          <Text style={styles.shareStatNumber}>{courseProgress.expectedGraduation}</Text>
          <Text style={styles.shareStatLabel}>Previsão de</Text>
          <Text style={styles.shareStatLabel}>Formatura</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.shareFooter}>
        <Text style={styles.shareFooterText}>Compartilhado via UNIJUÍ Mobile</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Progresso do Curso"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="share"
        onRightPress={handleShareProgress}
        showLeftIcon={true}
        showRightIcon={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progresso Geral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso Geral</Text>
          <View style={styles.progressCard}>
            <CircularProgress percentage={courseProgress.completionPercentage} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{courseProgress.course}</Text>
              <Text style={styles.courseDetails}>
                {courseProgress.completedCredits}/{courseProgress.totalCredits} créditos
              </Text>
              <Text style={styles.courseDetails}>
                {courseProgress.currentSemester} • Média: {courseProgress.generalAverage}
              </Text>
              <Text style={styles.expectedGraduation}>
                Previsão de formatura: {courseProgress.expectedGraduation}
              </Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="school-outline"
              title="Disciplinas Cursadas"
              value={courseProgress.subjects.completed}
              subtitle={`de ${courseProgress.subjects.total}`}
              color="#4CAF50"
            />
            <StatCard
              icon="time-outline"
              title="Em Andamento"
              value={courseProgress.subjects.inProgress}
              subtitle="disciplinas"
              color="#FF9800"
            />
            <StatCard
              icon="book-outline"
              title="Restantes"
              value={courseProgress.subjects.remaining}
              subtitle="disciplinas"
              color="#F44336"
            />
            <StatCard
              icon="trophy-outline"
              title="Média Geral"
              value={courseProgress.generalAverage.toFixed(1)}
              subtitle="pontos"
              color="#01458E"
            />
          </View>
        </View>

        {/* Progresso por Semestre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso por Semestre</Text>
          <View style={styles.semestersContainer}>
            {courseProgress.periods.map((period, index) => {
              const isCompleted = period.completed;
              const isInProgress = index === 6; // 7º semestre em andamento

              return (
                <SemesterCard
                  key={index}
                  period={period}
                  isCompleted={isCompleted}
                  isInProgress={isInProgress}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Card de compartilhamento (invisível) */}
      <View style={styles.hiddenShareContainer}>
        <ShareCard />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 8,
  },
  circularProgressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircleWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBackgroundCircle: {
    backgroundColor: 'transparent',
  },
  progressForegroundCircle: {
    // Círculo de progresso azul
  },
  progressMask: {
    // Máscara para ocultar partes não preenchidas
  },
  progressInnerCircle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#01458E',
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 14,
    color: '#666',
  },
  courseInfo: {
    alignItems: 'center',
  },
  courseName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  courseDetails: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  expectedGraduation: {
    fontSize: 15,
    color: '#01458E',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: (screenWidth - 52) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  semestersContainer: {
    gap: 12,
  },
  semesterCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedSemester: {
    borderLeftColor: '#4CAF50',
  },
  inProgressSemester: {
    borderLeftColor: '#FF9800',
  },
  semesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  semesterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  semesterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semesterCredits: {
    fontSize: 14,
    color: '#666',
  },
  semesterAverage: {
    fontSize: 14,
    color: '#01458E',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 30,
  },
  // Estilos para o card de compartilhamento
  hiddenShareContainer: {
    position: 'absolute',
    top: -9999, // Move para fora da tela
    left: 0,
    right: 0,
  },
  shareCard: {
    backgroundColor: '#fff',
    width: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  shareHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  shareLogoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shareLogoImage: {
    width: 120,
    height: 40,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shareProgressContainer: {
    marginBottom: 20,
  },
  shareCourseInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareCourseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  shareCourseDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  shareSemester: {
    fontSize: 14,
    color: '#01458E',
    fontWeight: '500',
    textAlign: 'center',
  },
  shareStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  shareStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  shareStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#01458E',
    marginBottom: 4,
  },
  shareStatLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  shareFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    width: '100%',
  },
  shareFooterText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default CourseProgressScreen;
