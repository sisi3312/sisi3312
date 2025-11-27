import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const useRandomSentence = () => {
  const [usedSentences, setUsedSentences] = useState(new Set());
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 문장 데이터 가져오기
  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const { data, error } = await supabase
          .from('sentences')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching sentences:', error);
        } else {
          setSentences(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, []);

  const getRandomSentence = useCallback((category = 'all', customSentences = []) => {
    let availableSentences = [...sentences, ...customSentences];
    
    if (category !== 'all') {
      availableSentences = availableSentences.filter(sentence => sentence.category === category);
    }
    
    if (availableSentences.length === 0) {
      return null;
    }
    
    // 사용하지 않은 문장들 필터링
    const unusedSentences = availableSentences.filter(
      sentence => !usedSentences.has(sentence.id)
    );
    
    // 모든 문장을 사용했다면 초기화
    if (unusedSentences.length === 0) {
      setUsedSentences(new Set());
      return availableSentences[Math.floor(Math.random() * availableSentences.length)];
    }
    
    // 랜덤하게 문장 선택
    const randomSentence = unusedSentences[Math.floor(Math.random() * unusedSentences.length)];
    
    // 사용된 문장으로 마킹
    setUsedSentences(prev => new Set([...prev, randomSentence.id]));
    
    return randomSentence;
  }, [sentences, usedSentences]);

  const resetUsedSentences = useCallback(() => {
    setUsedSentences(new Set());
  }, []);

  return { getRandomSentence, resetUsedSentences, loading };
};

export default useRandomSentence;