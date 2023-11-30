import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import { request } from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Post } from '../../../@types/blog';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import { SkeletonPostItem } from '../../../components/skeleton';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

BlogPosts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

const applySort = (posts: Post[], sortBy: string) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([]);

  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(posts, filters);

  const getAllPosts = useCallback(async () => {
    try {
      const response = await request.get('/api/blog/posts/all');

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value: string) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Blog: Posts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: 'Posts' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.blog.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Post
              </Button>
            </NextLink>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}