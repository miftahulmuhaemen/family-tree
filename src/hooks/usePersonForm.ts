import { useState, useEffect } from 'react';
import type { Person, Address, PhoneNumber, DeceasedInfo } from '@/types/family';

export interface UsePersonFormProps {
  person?: Person | null;
  isOpen: boolean;
}

export function usePersonForm({ person, isOpen }: UsePersonFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [isDeceased, setIsDeceased] = useState(false);
  const [deceasedDate, setDeceasedDate] = useState('');
  const [deceasedPlace, setDeceasedPlace] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (person) {
      setName(person.name || '');
      setGender(person.gender || 'male');
      setBirthDate(person.birthDate || '');

      const deceasedVal = person.deceased;
      if (typeof deceasedVal === 'boolean') {
        setIsDeceased(deceasedVal);
        setDeceasedDate('');
        setDeceasedPlace('');
      } else if (deceasedVal) {
        setIsDeceased(Boolean(deceasedVal.status));
        setDeceasedDate(deceasedVal.date || '');
        setDeceasedPlace(deceasedVal.place || '');
      } else {
        setIsDeceased(false);
        setDeceasedDate('');
        setDeceasedPlace('');
      }

      setShortBio(person.short_bio || '');
      setPhoneNumbers(person.phone_number ? [...person.phone_number] : []);
      setAddresses(person.address ? [...person.address] : []);
    } else {
      setName('');
      setGender('male');
      setBirthDate('');
      setIsDeceased(false);
      setDeceasedDate('');
      setDeceasedPlace('');
      setShortBio('');
      setPhoneNumbers([]);
      setAddresses([]);
    }
  }, [person, isOpen]);

  const addPhoneNumber = () => {
    setPhoneNumbers(prev => [...prev, { number: '', is_whatsapp_number: true }]);
  };

  const updatePhoneNumber = (index: number, field: keyof PhoneNumber, value: any) => {
    setPhoneNumbers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(prev => prev.filter((_, i) => i !== index));
  };

  const addAddress = () => {
    setAddresses(prev => [...prev, { address: '', gmap_link: '' }]);
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    setAddresses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeAddress = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };

  const buildPersonPayload = (): Person | null => {
    if (!name.trim()) return null;

    let deceasedData: boolean | DeceasedInfo | undefined = undefined;
    if (isDeceased) {
      deceasedData = {
        status: true,
        ...(deceasedDate ? { date: deceasedDate } : {}),
        ...(deceasedPlace.trim() ? { place: deceasedPlace.trim() } : {})
      };
    }

    const id = person?.id || `p_${crypto.randomUUID().slice(0, 8)}`;
    const validPhones = phoneNumbers.filter(p => p.number.trim());
    const validAddresses = addresses.filter(a => a.address.trim());

    return {
      id,
      name: name.trim(),
      gender,
      ...(birthDate ? { birthDate } : {}),
      ...(deceasedData !== undefined ? { deceased: deceasedData } : {}),
      ...(shortBio.trim() ? { short_bio: shortBio.trim() } : {}),
      ...(validPhones.length > 0 ? { phone_number: validPhones } : {}),
      ...(validAddresses.length > 0 ? { address: validAddresses } : {})
    };
  };

  return {
    name,
    setName,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    isDeceased,
    setIsDeceased,
    deceasedDate,
    setDeceasedDate,
    deceasedPlace,
    setDeceasedPlace,
    shortBio,
    setShortBio,
    phoneNumbers,
    addPhoneNumber,
    updatePhoneNumber,
    removePhoneNumber,
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    buildPersonPayload
  };
}
