import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultPfp from '../../asset/defaultPfp.png';
import getCookie from '../../helpers/getCookie';
import CoursePageTemplate from '../course/CoursePageTemplate';

const ForumPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const navigate = useNavigate();
  const { courseSlug } = useParams();
  const [sort, setSort] = React.useState([]);
  const [unsorted, setUnsorted] = React.useState([]);

  const [posts, setPosts] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [sortingValue, setSortingValue] = useState(0);

  const handleClickPreventDefault = (event) => {
    event.stopPropagation();
  };

  const handleChange = () => {
    if (sortingValue === 1) {
      setPosts([]);
      setPosts(
        sort.sort((postA, postB) =>
          postA.date_created.localeCompare(postB.date_created)
        )
      );
    } else if (sortingValue === 2) {
      setPosts([]);
      setPosts(
        sort.sort((postA, postB) =>
          postB.date_created.localeCompare(postA.date_created)
        )
      );
    } else if (sortingValue === 0) {
      setPosts([]);
      setPosts(
        sort
          .sort(function (postA, postB) {
            return postB.likes - postA.likes;
          })
          .sort(function (postA, postB) {
            return postB.num_comments - postA.num_comments;
          })
      );
    }
  };

  const postUnlike = async (post_id) => {
    try {
      await axios.delete(
        `/forum/${courseSlug.split('-')[1]}/post/${post_id}/unlike`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        })
        .then((response) => {
          navigate(`/course/${courseSlug}/forum`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const postLike = async (post_id) => {
    try {
      await axios.post(
          `/forum/${courseSlug.split('-')[1]}/post/${post_id}/like`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum`);
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    async function handleGetPosts() {
      try {
        await axios.get(`/forum/${courseSlug.split('-')[1]}`,
          {
            withCredentials: true,
          }).then((response) => {
            setPosts(response.data.posts);
            setUnsorted(response.data.posts);
            setSort(response.data.posts);
          });
      } catch (error) {
        alert(error);
      }
    }
    handleGetPosts();
  }, [courseSlug]);

  const handleTagFilter = (value) => {
    setPosts(sort.filter((post) => post.tag?.name == value));
  };

  const handleLikedSort = () => {
    setPosts(sort.filter((post) => post.liked_by_user == true));
  };

  const handleUnsort = () => {
    setPosts(unsorted);
  };

  const [tags, setTags] = useState([]);
  useEffect(() => {
    async function handleGetTags() {
      try {
        await axios.get(`/forum/${courseSlug.split('-')[1]}/tags`,
          {
            withCredentials: true,
          }).then((response) => {
            setTags(response.data.tags);
          });
      } catch (error) {
        alert(error);
      }
    }
    handleGetTags();
  }, []);

  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    async function getUser() {
      try {
        await axios.get(`/user`,
          {
            withCredentials: true,
          }).then((response) => {
            setIsStaff(response.data.user.is_staff);
          });
      } catch (error) {
        alert(error);
      }
    }
    getUser();
  }, []);

  const [userId, setUserId] = useState(false);
  useEffect(() => {
    async function getUser() {
      try {
        await axios.get(`/user`,
          {
            withCredentials: true,
          }).then((response) => {
            setIsStaff(response.data.user.is_staff);
            setUserId(response.data.user.id);
          });
      } catch (error) {
        alert(error);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Forum'}
        isStaff={isStaff ? 'staff' : 'student'}
        pageContent={
          <Box
            sx={{
              display: 'flex',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                flex: '1',
                bgcolor: 'white',
                boxSizing: 'border-box',
              }}
            >
              <Box sx={{ padding: '1rem' }}>
                <FormControl sx={{ width: '50%', minWidth: 120 }} fullWidth>
                  <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Latest First"
                    value={sortingValue}
                    onChange={(e) => {
                      setSortingValue(e.target.value);
                      handleChange();
                    }}
                  >
                    <MenuItem value={0}>Latest First</MenuItem>
                    <MenuItem value={1}>Earliest First</MenuItem>
                    <MenuItem value={2}>Most Popular</MenuItem>
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    maxHeight: isSmallScreen ? '70vh' : '75vh',
                    overflow: 'auto',
                  }}
                >
                  {posts.map((post) => {
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          bgcolor: 'grey.200',
                          width: '90%',
                          height: 'fit-content',
                          borderRadius: '1rem',
                          alignItems: 'center',
                          marginTop: '2rem',
                          paddingRight: '2rem',
                          paddingTop: '1rem',
                          paddingBottom: '1rem',
                          boxShadow: 3,
                          '&:hover': {
                            bgcolor: 'grey.300',
                            cursor: 'pointer',
                            border: 3,
                            borderColor: '#5AC2D9',
                            borderStyle: 'outset',
                          },
                        }}
                        value={post.id}
                        onClick={(e) => {
                          handleClickPreventDefault(e);
                          navigate(
                            `/course/${courseSlug}/forum/${post.id}/comments`
                          );
                        }}
                      >
                        <Box
                          sx={{
                            flex: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              margin: '1rem',
                            }}
                          >
                            <Box
                              sx={{
                                borderRadius: '50%',
                                bgcolor: 'grey.300',
                                marginBottom: '0.5rem',
                                width: '6.5rem',
                                height: '6.5rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={defaultPfp}
                                alt="defaultPfp"
                                style={{
                                  height: 4 + 'rem',
                                }}
                              />
                            </Box>
                            <Box>
                              {post.anonymous
                                ? 'Anonymous'
                                : post.created_by.firstname +
                                  ' ' +
                                  post.created_by.lastname}
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            height: 'auto',
                            flex: '3',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Box
                            sx={{
                              marginTop: '0.5rem',
                              marginBottom: '0.5rem',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}
                          >
                            {post.title}
                          </Box>
                          {post.text}
                          {post.image_codes?.length > 0 && post.image_codes ? (
                            <>
                              <img
                                alt="not found"
                                style={{
                                  marginTop: 1 + 'rem',
                                }}
                                width={'250px'}
                                maxHeight={'500px'}
                                src={post.image_codes[0].code}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              flex: '1',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            {post.tag ? (
                              <Box
                                sx={{
                                  marginTop: '0.5rem',
                                  marginBottom: '0.5rem',
                                  fontSize: 16,
                                  borderRadius: '0.5rem',
                                  border: 1,
                                  backgroundColor: 'grey.100',
                                  display: 'flex',
                                  padding: '0.4rem',
                                  paddingRight: '1rem',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: 3,
                                }}
                              >
                                <Box
                                  sx={{
                                    borderRadius: '50%',
                                    bgcolor: `${post.tag?.colour}`,
                                    marginLeft: '0.7rem',
                                    marginRight: '0.7rem',
                                    width: '1rem',
                                    height: '1rem',
                                    boxShadow: 3,
                                  }}
                                />
                                {post.tag?.name}
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {post.liked_by_user ? (
                              <Button
                                sx={{
                                  display: 'flex',
                                  '&:hover': {
                                    bgcolor: 'grey.200',
                                  },
                                }}
                                id={'heart-filled-' + post.id}
                                onClick={(e) => {
                                  handleClickPreventDefault(e);
                                  postUnlike(post.id);
                                  post.liked_by_user = false;
                                  post.num_likes -= 1;
                                }}
                              >
                                <svg
                                  width="26"
                                  height="25"
                                  viewBox="0 0 26 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.16797 9.51763C2.16797 14.5833 6.52297 17.2822 9.71013 19.6989C10.8346 20.551 11.918 21.3541 13.0013 21.3541C14.0846 21.3541 15.168 20.552 16.2925 19.6978C19.4807 17.2833 23.8346 14.5833 23.8346 9.51868C23.8346 4.45305 17.8763 0.860343 13.0013 5.73118C8.1263 0.859302 2.16797 4.45201 2.16797 9.51763Z"
                                    fill="#597795"
                                  />
                                </svg>
                                <Box
                                  sx={{
                                    marginLeft: '0.2rem',
                                    fontSize: '1.2rem',
                                  }}
                                  id={'liked-' + post.id}
                                >
                                  {post.num_likes}
                                </Box>
                              </Button>
                            ) : (
                              <Button
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  '&:hover': {
                                    bgcolor: 'grey.200',
                                  },
                                }}
                                id={'heart-empty-' + post.id}
                                onClick={(e) => {
                                  handleClickPreventDefault(e);
                                  postLike(post.id);
                                  post.liked_by_user = true;
                                  post.num_likes += 1;
                                }}
                              >
                                <svg
                                  width="24"
                                  height="20"
                                  viewBox="0 0 24 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.5997 2.15595C12.8077 0.792982 14.5907 0 16.5996 0C18.3494 0.00211705 20.0268 0.698136 21.2641 1.93539C22.5013 3.17264 23.1973 4.85011 23.1995 6.59985C23.1995 13.8337 12.6187 19.6135 12.1687 19.8565C11.9939 19.9507 11.7983 20 11.5997 20C11.4011 20 11.2056 19.9507 11.0307 19.8565C10.5808 19.6135 0 13.8337 0 6.59985C0.00211705 4.85011 0.698136 3.17264 1.93539 1.93539C3.17264 0.698136 4.85011 0.00211705 6.59985 0C8.6088 0 10.3918 0.792982 11.5997 2.15595ZM11.5997 17.4156C13.1691 16.4811 14.6579 15.4175 16.0506 14.2357C18.2176 12.3767 20.7995 9.54178 20.7995 6.59985C20.7995 5.48596 20.357 4.4177 19.5694 3.63007C18.7818 2.84243 17.7135 2.39994 16.5996 2.39994C14.8197 2.39994 13.3297 3.33992 12.7107 4.85389C12.6206 5.07459 12.4668 5.26346 12.269 5.3964C12.0711 5.52935 11.8381 5.60035 11.5997 5.60035C11.3614 5.60035 11.1284 5.52935 10.9305 5.3964C10.7326 5.26346 10.5788 5.07459 10.4888 4.85389C9.86977 3.33992 8.37981 2.39994 6.59985 2.39994C5.48596 2.39994 4.4177 2.84243 3.63007 3.63007C2.84243 4.4177 2.39994 5.48596 2.39994 6.59985C2.39994 9.54178 4.98188 12.3767 7.14883 14.2357C8.54153 15.4175 10.0303 16.4811 11.5997 17.4156Z"
                                    fill="#597795"
                                  />
                                </svg>
                                <Box
                                  sx={{
                                    marginLeft: '0.2rem',
                                    fontSize: '1.2rem',
                                  }}
                                  id={'unliked-' + post.id}
                                >
                                  {post.num_likes}
                                </Box>
                              </Button>
                            )}
                            <Button
                              sx={{
                                height: '3rem',
                                '&:hover': {
                                  bgcolor: 'grey.200',
                                },
                              }}
                              onClick={() => {
                                navigate(
                                  `/course/${courseSlug}/forum/${post.id}/comments`
                                );
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.0282 0C8.71497 0 7.41461 0.258658 6.20135 0.761205C4.9881 1.26375 3.8857 2.00035 2.95712 2.92893C1.08175 4.8043 0.0281864 7.34784 0.0281864 10C0.0194442 12.3091 0.818979 14.5485 2.28819 16.33L0.288186 18.33C0.149429 18.4706 0.0554325 18.6492 0.0180584 18.8432C-0.0193158 19.0372 0.0016069 19.2379 0.0781863 19.42C0.161244 19.5999 0.29589 19.7511 0.465033 19.8544C0.634176 19.9577 0.830187 20.0083 1.02819 20H10.0282C12.6804 20 15.2239 18.9464 17.0993 17.0711C18.9746 15.1957 20.0282 12.6522 20.0282 10C20.0282 7.34784 18.9746 4.8043 17.0993 2.92893C15.2239 1.05357 12.6804 0 10.0282 0ZM10.0282 18H3.43819L4.36819 17.07C4.55444 16.8826 4.65898 16.6292 4.65898 16.365C4.65898 16.1008 4.55444 15.8474 4.36819 15.66C3.05877 14.352 2.24336 12.6305 2.06088 10.7888C1.87839 8.94705 2.34013 7.09901 3.36741 5.55952C4.3947 4.02004 5.92398 2.88436 7.6947 2.34597C9.46543 1.80759 11.368 1.8998 13.0784 2.60691C14.7888 3.31402 16.201 4.59227 17.0746 6.22389C17.9482 7.85551 18.2291 9.73954 17.8693 11.555C17.5096 13.3705 16.5315 15.005 15.1017 16.1802C13.672 17.3554 11.8789 17.9985 10.0282 18Z"
                                    fill="#597795"
                                  />
                                </svg>
                                <Box
                                  sx={{
                                    marginLeft: '0.2rem',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                  }}
                                >
                                  {post.num_comments}
                                </Box>
                              </Box>
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                border: 1,
                borderColor: 'grey.200',
                height: '80vh',
                marginRight: '1rem',
                marginTop: '1rem',
              }}
            />
            <Box
              sx={{
                width: '14rem',
                height: '100%',
                padding: '1rem',
                display: 'flex',
                boxSizing: 'border-box',
                flexDirection: 'column',
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/course/${courseSlug}/forum/create-post`);
                }}
                sx={{
                  textTransform: 'none',
                }}
              >
                Create Post
              </Button>
              <Button
                sx={{ marginTop: '1rem' }}
                variant="contained"
                onClick={handleUnsort}
              >
                All Discussions
              </Button>
              <Button sx={{ marginTop: '1rem' }} onClick={handleLikedSort}>
                Liked Posts
              </Button>
              <Box sx={{ border: 1, borderColor: 'grey.200', width: '90%' }} />
              <Box
                sx={{
                  margin: '0.5rem',
                  marginLeft: '20%',
                  maxHeight: isSmallScreen ? '45vh' : '75vh',
                  overflow: 'auto',
                }}
              >
                {tags.map((tag) => {
                  return (
                    <Button
                      sx={{
                        display: 'flex',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        justifyContent: 'left',
                      }}
                      onClick={() => {
                        handleTagFilter(tag.name);
                      }}
                    >
                      <Box
                        sx={{
                          width: '1rem',
                          height: '1rem',
                          bgcolor: `${tag.colour}`,
                          borderRadius: '50%',
                          marginRight: '0.5rem',
                          boxShadow: 3,
                        }}
                      ></Box>
                      <Box
                        sx={{
                          textTransform: 'none',
                        }}
                      >
                        {tag.name}
                      </Box>
                    </Button>
                  );
                })}
                <Button
                  onClick={() => {
                    navigate(`/course/${courseSlug}/forum/create-tag`);
                  }}
                  sx={{
                    display: isStaff ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.5rem',
                    textTransform: 'capitalize',
                  }}
                  variant="contained"
                >
                  <Box>create tag</Box>
                </Button>
              </Box>
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default ForumPage;