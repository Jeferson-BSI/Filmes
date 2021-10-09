import React, { useState, useEffect } from 'react';
import { ScrollView, Modal } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api, { key } from '../../services/api';

import { Genres } from '../../components/Genres';
import { ModalLink } from '../../components/ModalLink';
import { IMovies } from '../../utils/movie';

//@ts-ignore
import Stars from 'react-native-stars';

import {
  Container,
  Header,
  HeaderButton,
  Banner,
  ButtonLink,
  Title,
  ContentArea,
  Rate,
  ListGenres,
  Description,
} from './styles';

type IParams = {
  Detail: { id: number };
};
export const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<IParams, 'Detail'>>();

  const [movie, setMovie] = useState<IMovies | null>(null);
  const [openLink, setOpenLink] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function getMovies() {
      console.log(route.params?.id);

      const response = await api.get<IMovies>(`/movie/${route.params?.id}`, {
        params: {
          api_key: key,
          language: 'pt-BR',
        },
      });

      if (isActive) {
        setMovie(response.data);
      }
    }

    if (isActive) {
      getMovies();
    }

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Container>
      <Header>
        <HeaderButton activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color="#fff" />
        </HeaderButton>

        <HeaderButton>
          <Ionicons name="bookmark" size={28} color="#fff" />
        </HeaderButton>
      </Header>
      <Banner
        resizeMethod="scale"
        source={{
          uri: `https://image.tmdb.org/t/p/original/${movie?.poster_path}`,
        }}
      />

      <ButtonLink onPress={() => setOpenLink(!openLink)}>
        <Feather name="link" size={30} color="#fff" />
      </ButtonLink>

      <Title numberOfLines={2}>{movie?.title}</Title>

      <ContentArea>
        <Stars
          default={movie?.vote_average}
          count={10}
          half={true}
          starSize={20}
          fullStar={<Ionicons name="md-star" size={24} color="#E7a74e" />}
          emptyStar={
            <Ionicons name="md-star-outline" size={24} color="#E7a74e" />
          }
          halfStar={<Ionicons name="md-star-half" size={24} color="#E7a74e" />}
          dissable={true}
        />

        <Rate>{movie?.vote_average}/10</Rate>
      </ContentArea>
      <ListGenres
        data={movie?.genres}
        //@ts-ignore
        renderItem={({ item }) => <Genres data={item} />}
        //@ts-ignore
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Descrição</Title>
        <Description>{movie?.overview}</Description>
      </ScrollView>

      <Modal animationType="slide" transparent visible={openLink}>
        <ModalLink
          link={movie?.homepage}
          title={movie?.title}
          closeModal={() => setOpenLink(false)}
        />
      </Modal>
    </Container>
  );
};
