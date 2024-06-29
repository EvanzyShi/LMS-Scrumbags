import { Box, Button, InputLabel, TextField } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultPfp from '../../asset/defaultPfp.png';
import getCookie from '../../helpers/getCookie';
import CoursePageTemplate from '../course/CoursePageTemplate';
import { fileToDataUrl } from './ForumHelper.js';

const Comments = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const navigate = useNavigate();
  const { courseSlug, post_id } = useParams();
  const [post, setPost] = React.useState('');
  const [postText, setPostText] = React.useState('');
  const [postTitle, setPostTitle] = React.useState('');
  const [postImage, setPostImage] = React.useState('');
  const [commentText, setCommentText] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isEditingComment, setIsEditingComment] = React.useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [editingCommentId, setEditingCommentId] = React.useState(-1);
  const [selectedImage, setSelectedImage] = useState('');

  const postImageDelete = async (post_image_id) => {
    try {
      await axios.delete(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/image/${post_image_id}`,
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          // setPostImage('');
        });
    } catch (error) {
      alert(error);
    }
  };

  const postImageAdd = async () => {
    try {
      await axios.post(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/image/add`,
          { image_codes: [postImage] },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          // post.image_codes[0].code = postImage;
        });
    } catch (error) {
      alert(error);
    }
  };

  const commentDelete = async (comment_id) => {
    try {
      await axios.delete(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/comment/${comment_id}/delete`,
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          setComments(
            comments.filter((comment) => {
              return comment.id != comment_id;
            })
          );
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const postDelete = async () => {
    try {
      await axios.delete(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/delete`,
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

  const postUnlike = async () => {
    try {
      await axios.delete(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/unlike`, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        })
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const postLike = async () => {
    try {
      await axios.post(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/like`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const commentUnlike = async (comment_id) => {
    try {
      await axios.delete(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/comment/${comment_id}/unlike`,
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const commentLike = async (comment_id) => {
    try {
      await axios.post(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/comment/${comment_id}/like`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const commentEdit = async (comment_Id, text) => {
    try {
      await axios.put(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/comment/${comment_Id}/edit`,
          {
            text: text,
          },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        })
        .then(() => {
          setIsEditingComment(false);
        });
    } catch (error) {
      alert(error);
    }
  };

  const postEdit = async (title, text, tag_id) => {
    try {
      await axios.put(`/forum/${courseSlug.split('-')[1]}/post/${post_id}/edit`,
          {
            title: title,
            text: text,
            tag_id: tag_id,
          },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        })
        .then(() => {
          setIsEditing(false);
        });
    } catch (error) {
      alert(error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`/forum/${courseSlug.split('-')[1]}/post/${Number(post_id)}/comment/create`,
          {
            text: description,
          },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then(() => {
          setDescription('');
          setIsClicked(false);
          handleGetComments();
          navigate(`/course/${courseSlug}/forum/${post_id}/comments`);
        });
    } catch (error) {
      alert(error);
    }
  };

  const [comments, setComments] = useState([]);
  async function handleGetComments() {
    try {
      await axios.get(`/forum/${courseSlug.split('-')[1]}/post/${post_id}`,
        {
          withCredentials: true,
        })
        .then((response) => {
          setPost(response.data.post);
          setPostText(response.data.post.text);
          setPostImage(response.data.post.image_codes ? [0].code : '');
          setPostTitle(response.data.post.title);
          setComments(response.data.comments);
        });
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    handleGetComments();
  }, []);

  const refInput = React.useRef();

  const [isStaff, setIsStaff] = useState(false);
  const [userId, setUserId] = useState(false);
  useEffect(() => {
    async function getUser() {
      try {
        await axios.get(`/user`,
          {
            withCredentials: true,
          })
          .then((response) => {
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
        page={'forum'}
        isStaff={isStaff ? 'staff' : 'student'}
        pageContent={
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box
              sx={{
                flex: '1',
                bgcolor: 'white',
              }}
            >
              <Box sx={{ padding: '1rem' }}>
                <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                  <Box
                    sx={{
                      marginTop: '0.5rem',
                      fontSize: 32,
                      fontWeight: 'bold',
                    }}
                  >
                    Post
                  </Box>
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
                            : post.created_by?.firstname +
                              ' ' +
                              post.created_by?.lastname}
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        height: 'auto',
                        flex: '3',
                      }}
                    >
                      {isEditing ? (
                        <>
                          <TextField
                            label="Title - press Enter/Edit Button to save"
                            variant="filled"
                            value={postTitle}
                            onChange={(event) => {
                              setPostTitle(event.target.value);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                postEdit(postTitle, postText, post.tag?.id);
                                postImageAdd(postImage);
                              }
                            }}
                            sx={{
                              width: '90%',
                              fontSize: 16,
                              fontWeight: 'bold',
                              marginBottom: '1rem',
                            }}
                          />
                          <TextField
                            label="Description - press Enter/Edit Button to save"
                            multiline
                            rows={8}
                            variant="filled"
                            sx={{
                              width: '90%',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}
                            ref={refInput}
                            value={postText}
                            onChange={(event) => {
                              setPostText(event.target.value);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                postEdit(postTitle, postText, post.tag?.id);
                                postImageAdd(postImage);
                              }
                            }}
                          />
                          {postImage && (
                            <Box
                              sx={{
                                display: 'flex',
                                height: '5rem',
                                width: '1rem',
                                marginTop: '1rem',
                                justifyContent: 'space-between',
                              }}
                            >
                              <img
                                alt="not found"
                                width={'250px'}
                                src={postImage}
                              />
                              <br />
                              <Button
                                onClick={() => {
                                  if (
                                    post.image_codes?.length > 0 &&
                                    postImage
                                  ) {
                                    post.image_codes.map((image_code) => {
                                      postImageDelete(image_code.id);
                                    });
                                  }
                                  setPostImage('');
                                }}
                                sx={{
                                  textTransform: 'capitalize',
                                }}
                              >
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_1192_319)">
                                    <path
                                      d="M7.61161 2.11641L6.76339 3.28125H13.2366L12.3884 2.11641C12.3214 2.02617 12.2098 1.96875 12.0893 1.96875H7.90625C7.78571 1.96875 7.67411 2.02207 7.60714 2.11641H7.61161ZM14.1741 1.02539L15.8125 3.28125H18.9286C19.5223 3.28125 20 3.72012 20 4.26562C20 4.81113 19.5223 5.25 18.9286 5.25H18.5714V17.7188C18.5714 19.5316 16.9732 21 15 21H5C3.02679 21 1.42857 19.5316 1.42857 17.7188V5.25H1.07143C0.477679 5.25 0 4.81113 0 4.26562C0 3.72012 0.477679 3.28125 1.07143 3.28125H4.1875L5.82589 1.02129C6.29018 0.385547 7.07143 0 7.90625 0H12.0893C12.9241 0 13.7054 0.385547 14.1696 1.02129L14.1741 1.02539ZM3.57143 5.25V17.7188C3.57143 18.4447 4.20982 19.0312 5 19.0312H15C15.7902 19.0312 16.4286 18.4447 16.4286 17.7188V5.25H3.57143ZM7.14286 7.875V16.4062C7.14286 16.7672 6.82143 17.0625 6.42857 17.0625C6.03571 17.0625 5.71429 16.7672 5.71429 16.4062V7.875C5.71429 7.51406 6.03571 7.21875 6.42857 7.21875C6.82143 7.21875 7.14286 7.51406 7.14286 7.875ZM10.7143 7.875V16.4062C10.7143 16.7672 10.3929 17.0625 10 17.0625C9.60714 17.0625 9.28571 16.7672 9.28571 16.4062V7.875C9.28571 7.51406 9.60714 7.21875 10 7.21875C10.3929 7.21875 10.7143 7.51406 10.7143 7.875ZM14.2857 7.875V16.4062C14.2857 16.7672 13.9643 17.0625 13.5714 17.0625C13.1786 17.0625 12.8571 16.7672 12.8571 16.4062V7.875C12.8571 7.51406 13.1786 7.21875 13.5714 7.21875C13.9643 7.21875 14.2857 7.51406 14.2857 7.875Z"
                                      fill="#A31010"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1192_319">
                                      <rect
                                        width="20"
                                        height="21"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </Button>
                            </Box>
                          )}
                          <Button component="label">
                            <InputLabel
                              htmlFor="image_uploads"
                              variant="contained"
                              sx={{
                                textTransform: 'capitalize',
                                '&:hover': {
                                  cursor: 'pointer',
                                },
                              }}
                            >
                              + Upload Image
                            </InputLabel>
                            <input
                              type="file"
                              id="image_uploads"
                              name="image_uploads"
                              onChange={(event) => {
                                fileToDataUrl(event.target.files[0])
                                  .then((base64String) => {
                                    setPostImage(base64String);
                                  })
                                  .catch((msg) => {
                                    alert(msg);
                                  });
                              }}
                              hidden
                            />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Box
                            sx={{
                              marginTop: '0.5rem',
                              marginBottom: '0.5rem',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}
                          >
                            {postTitle}
                          </Box>
                          <div>{postText}</div>
                          {post.image_codes?.length > 0 && postImage ? (
                            <img
                              alt="not found"
                              style={{
                                marginTop: 1 + 'rem',
                              }}
                              width={'250px'}
                              maxHeight={'500px'}
                              src={postImage}
                            />
                          ) : (
                            <></>
                          )}
                        </>
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
                              display: 'flex',
                              padding: '0.4rem',
                              paddingRight: '1rem',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'grey.100',
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
                              postUnlike();
                              post.num_likes -= 1;
                              post.liked_by_user = false;
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
                              postLike();
                              post.num_likes += 1;
                              post.liked_by_user = true;
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
                        <Button sx={{ height: '3rem' }}>
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
                        <Button
                          sx={{
                            height: '3rem',
                            display:
                              post.created_by?.id == userId ? 'flex' : 'none',
                          }}
                          onClick={() => {
                            if (isEditing) {
                              postEdit(postTitle, postText, post.tag?.id);
                              postImageAdd(postImage);
                            }
                            setIsEditing(!isEditing);
                            refInput.current?.focus();
                          }}
                        >
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M14.3524 2.0095C14.389 1.99905 14.4274 1.99721 14.4646 2.00405C15.3435 2.25183 16.1399 2.73026 16.7708 3.38961C16.7802 3.39934 16.7897 3.40888 16.7994 3.41822C17.4586 4.05364 17.9345 4.85418 18.1775 5.73587C18.1846 5.77307 18.1829 5.81148 18.1724 5.84801C18.161 5.88791 18.1394 5.92433 18.1097 5.95373L18.1066 5.95685L16.6281 7.43197L12.755 3.56359L14.2428 2.07556L14.2428 2.07556L14.2458 2.07253C14.2753 2.04284 14.312 2.02109 14.3524 2.0095ZM11.3408 4.97789L15.2123 8.84459L6.52474 17.5126L6.52355 17.5138C6.48597 17.5504 6.4374 17.5741 6.38496 17.5811L6.38495 17.581L6.37357 17.5827L2.27913 18.1793C2.24104 18.1848 2.20217 18.1813 2.16572 18.1691C2.12927 18.1568 2.09633 18.1362 2.06954 18.109C2.04275 18.0818 2.02285 18.0488 2.01135 18.0126C2.00068 17.9791 1.99749 17.9437 2.00196 17.9089L2.00569 17.8853L2.60298 13.7949L2.60303 13.7949L2.60433 13.7854C2.61158 13.7322 2.63547 13.6847 2.67093 13.6489L2.67128 13.6486L11.3408 4.97789ZM0.0292545 17.5787L0.0292257 17.5789C-0.0275321 17.9268 -0.00137475 18.2833 0.105556 18.6192C0.212485 18.9552 0.397149 19.2611 0.644473 19.5123C0.891791 19.7634 1.1948 19.9527 1.52887 20.065C1.86294 20.1772 2.21875 20.2092 2.56748 20.1584L6.65707 19.5625C7.13769 19.4967 7.58426 19.277 7.92968 18.9361L7.92969 18.9361L7.93352 18.9323L19.516 7.37579L19.5181 7.37378C19.7904 7.10374 19.9891 6.76835 20.0949 6.39957C20.2009 6.02988 20.2101 5.63913 20.1215 5.26485C20.119 5.25441 20.1164 5.24401 20.1136 5.23365C19.7795 4.00096 19.119 2.88128 18.2018 1.99226C17.3178 1.07368 16.2026 0.409557 14.9732 0.0695456C14.961 0.0661776 14.9488 0.0630406 14.9365 0.0601365C14.5623 -0.028224 14.1717 -0.0190799 13.8021 0.0867002C13.4333 0.192264 13.0976 0.390567 12.8272 0.662775L12.8255 0.664459L1.25564 12.2358L1.25431 12.2371C0.909479 12.5833 0.689832 13.0308 0.623373 13.51L0.0292545 17.5787Z"
                              fill="#597795"
                            />
                          </svg>
                        </Button>
                        <Button
                          sx={{
                            height: '3rem',
                            display:
                              post.created_by?.id == userId ? 'flex' : 'none',
                          }}
                          onClick={() => {
                            postDelete();
                          }}
                        >
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1192_319)">
                              <path
                                d="M7.61161 2.11641L6.76339 3.28125H13.2366L12.3884 2.11641C12.3214 2.02617 12.2098 1.96875 12.0893 1.96875H7.90625C7.78571 1.96875 7.67411 2.02207 7.60714 2.11641H7.61161ZM14.1741 1.02539L15.8125 3.28125H18.9286C19.5223 3.28125 20 3.72012 20 4.26562C20 4.81113 19.5223 5.25 18.9286 5.25H18.5714V17.7188C18.5714 19.5316 16.9732 21 15 21H5C3.02679 21 1.42857 19.5316 1.42857 17.7188V5.25H1.07143C0.477679 5.25 0 4.81113 0 4.26562C0 3.72012 0.477679 3.28125 1.07143 3.28125H4.1875L5.82589 1.02129C6.29018 0.385547 7.07143 0 7.90625 0H12.0893C12.9241 0 13.7054 0.385547 14.1696 1.02129L14.1741 1.02539ZM3.57143 5.25V17.7188C3.57143 18.4447 4.20982 19.0312 5 19.0312H15C15.7902 19.0312 16.4286 18.4447 16.4286 17.7188V5.25H3.57143ZM7.14286 7.875V16.4062C7.14286 16.7672 6.82143 17.0625 6.42857 17.0625C6.03571 17.0625 5.71429 16.7672 5.71429 16.4062V7.875C5.71429 7.51406 6.03571 7.21875 6.42857 7.21875C6.82143 7.21875 7.14286 7.51406 7.14286 7.875ZM10.7143 7.875V16.4062C10.7143 16.7672 10.3929 17.0625 10 17.0625C9.60714 17.0625 9.28571 16.7672 9.28571 16.4062V7.875C9.28571 7.51406 9.60714 7.21875 10 7.21875C10.3929 7.21875 10.7143 7.51406 10.7143 7.875ZM14.2857 7.875V16.4062C14.2857 16.7672 13.9643 17.0625 13.5714 17.0625C13.1786 17.0625 12.8571 16.7672 12.8571 16.4062V7.875C12.8571 7.51406 13.1786 7.21875 13.5714 7.21875C13.9643 7.21875 14.2857 7.51406 14.2857 7.875Z"
                                fill="#A31010"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1192_319">
                                <rect width="20" height="21" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginTop: '1rem',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                  >
                    Comments
                  </Box>
                  <Box
                    sx={{
                      marginLeft: '7rem',
                    }}
                  >
                    {comments.map((comment) => {
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
                            boxShadow: 3,
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
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              height: 'auto',
                              flex: '3',
                            }}
                          >
                            <Box
                              sx={{
                                marginTop: '0.5rem',
                                marginBottom: '0.5rem',
                                fontSize: 16,
                              }}
                            >
                              {comment.created_by.firstname +
                                ' ' +
                                comment.created_by.lastname}
                            </Box>
                            {isEditingComment &&
                            editingCommentId == comment.id ? (
                              <>
                                <TextField
                                  label="Description - press Enter/Edit Button to save"
                                  multiline
                                  rows={8}
                                  variant="filled"
                                  sx={{
                                    width: '90%',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                  }}
                                  value={commentText}
                                  onChange={(event) => {
                                    setCommentText(event.target.value);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      comment.text = commentText;
                                      commentEdit(comment.id, commentText);
                                    }
                                  }}
                                />
                              </>
                            ) : (
                              <div>{comment.text}</div>
                            )}
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex' }}>
                              {comment.liked_by_user ? (
                                <Button
                                  sx={{ display: 'flex' }}
                                  id={'heart-filled-' + comment.id}
                                  onClick={(e) => {
                                    commentUnlike(comment.id);
                                    comment.num_likes -= 1;
                                    comment.liked_by_user = false;
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
                                    id={'liked-' + comment.id}
                                  >
                                    {comment.num_likes}
                                  </Box>
                                </Button>
                              ) : (
                                <Button
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  id={'heart-empty-' + comment.id}
                                  onClick={(e) => {
                                    commentLike(comment.id);
                                    comment.num_likes += 1;
                                    comment.liked_by_user = true;
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
                                    id={'unliked-' + comment.id}
                                  >
                                    {comment.num_likes}
                                  </Box>
                                </Button>
                              )}
                              <Button
                                sx={{
                                  height: '3rem',
                                  display:
                                    comment.created_by?.id == userId
                                      ? 'flex'
                                      : 'none',
                                }}
                                onClick={() => {
                                  setIsEditingComment(!isEditingComment);
                                  setEditingCommentId(comment.id);
                                  setCommentText(comment.text);
                                }}
                              >
                                <svg
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M14.3524 2.0095C14.389 1.99905 14.4274 1.99721 14.4646 2.00405C15.3435 2.25183 16.1399 2.73026 16.7708 3.38961C16.7802 3.39934 16.7897 3.40888 16.7994 3.41822C17.4586 4.05364 17.9345 4.85418 18.1775 5.73587C18.1846 5.77307 18.1829 5.81148 18.1724 5.84801C18.161 5.88791 18.1394 5.92433 18.1097 5.95373L18.1066 5.95685L16.6281 7.43197L12.755 3.56359L14.2428 2.07556L14.2428 2.07556L14.2458 2.07253C14.2753 2.04284 14.312 2.02109 14.3524 2.0095ZM11.3408 4.97789L15.2123 8.84459L6.52474 17.5126L6.52355 17.5138C6.48597 17.5504 6.4374 17.5741 6.38496 17.5811L6.38495 17.581L6.37357 17.5827L2.27913 18.1793C2.24104 18.1848 2.20217 18.1813 2.16572 18.1691C2.12927 18.1568 2.09633 18.1362 2.06954 18.109C2.04275 18.0818 2.02285 18.0488 2.01135 18.0126C2.00068 17.9791 1.99749 17.9437 2.00196 17.9089L2.00569 17.8853L2.60298 13.7949L2.60303 13.7949L2.60433 13.7854C2.61158 13.7322 2.63547 13.6847 2.67093 13.6489L2.67128 13.6486L11.3408 4.97789ZM0.0292545 17.5787L0.0292257 17.5789C-0.0275321 17.9268 -0.00137475 18.2833 0.105556 18.6192C0.212485 18.9552 0.397149 19.2611 0.644473 19.5123C0.891791 19.7634 1.1948 19.9527 1.52887 20.065C1.86294 20.1772 2.21875 20.2092 2.56748 20.1584L6.65707 19.5625C7.13769 19.4967 7.58426 19.277 7.92968 18.9361L7.92969 18.9361L7.93352 18.9323L19.516 7.37579L19.5181 7.37378C19.7904 7.10374 19.9891 6.76835 20.0949 6.39957C20.2009 6.02988 20.2101 5.63913 20.1215 5.26485C20.119 5.25441 20.1164 5.24401 20.1136 5.23365C19.7795 4.00096 19.119 2.88128 18.2018 1.99226C17.3178 1.07368 16.2026 0.409557 14.9732 0.0695456C14.961 0.0661776 14.9488 0.0630406 14.9365 0.0601365C14.5623 -0.028224 14.1717 -0.0190799 13.8021 0.0867002C13.4333 0.192264 13.0976 0.390567 12.8272 0.662775L12.8255 0.664459L1.25564 12.2358L1.25431 12.2371C0.909479 12.5833 0.689832 13.0308 0.623373 13.51L0.0292545 17.5787Z"
                                    fill="#597795"
                                  />
                                </svg>
                              </Button>
                              <Button
                                sx={{
                                  height: '3rem',
                                  display:
                                    comment.created_by?.id == userId
                                      ? 'flex'
                                      : 'none',
                                }}
                                onClick={() => {
                                  commentDelete(comment.id);
                                }}
                              >
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_1192_319)">
                                    <path
                                      d="M7.61161 2.11641L6.76339 3.28125H13.2366L12.3884 2.11641C12.3214 2.02617 12.2098 1.96875 12.0893 1.96875H7.90625C7.78571 1.96875 7.67411 2.02207 7.60714 2.11641H7.61161ZM14.1741 1.02539L15.8125 3.28125H18.9286C19.5223 3.28125 20 3.72012 20 4.26562C20 4.81113 19.5223 5.25 18.9286 5.25H18.5714V17.7188C18.5714 19.5316 16.9732 21 15 21H5C3.02679 21 1.42857 19.5316 1.42857 17.7188V5.25H1.07143C0.477679 5.25 0 4.81113 0 4.26562C0 3.72012 0.477679 3.28125 1.07143 3.28125H4.1875L5.82589 1.02129C6.29018 0.385547 7.07143 0 7.90625 0H12.0893C12.9241 0 13.7054 0.385547 14.1696 1.02129L14.1741 1.02539ZM3.57143 5.25V17.7188C3.57143 18.4447 4.20982 19.0312 5 19.0312H15C15.7902 19.0312 16.4286 18.4447 16.4286 17.7188V5.25H3.57143ZM7.14286 7.875V16.4062C7.14286 16.7672 6.82143 17.0625 6.42857 17.0625C6.03571 17.0625 5.71429 16.7672 5.71429 16.4062V7.875C5.71429 7.51406 6.03571 7.21875 6.42857 7.21875C6.82143 7.21875 7.14286 7.51406 7.14286 7.875ZM10.7143 7.875V16.4062C10.7143 16.7672 10.3929 17.0625 10 17.0625C9.60714 17.0625 9.28571 16.7672 9.28571 16.4062V7.875C9.28571 7.51406 9.60714 7.21875 10 7.21875C10.3929 7.21875 10.7143 7.51406 10.7143 7.875ZM14.2857 7.875V16.4062C14.2857 16.7672 13.9643 17.0625 13.5714 17.0625C13.1786 17.0625 12.8571 16.7672 12.8571 16.4062V7.875C12.8571 7.51406 13.1786 7.21875 13.5714 7.21875C13.9643 7.21875 14.2857 7.51406 14.2857 7.875Z"
                                      fill="#A31010"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1192_319">
                                      <rect
                                        width="20"
                                        height="21"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ border: 1, borderColor: 'grey.500', width: '100%' }} />
              <Box
                sx={{
                  marginTop: '2rem',
                  width: '100%',
                }}
              >
                <TextField
                  id="filled-multiline-static"
                  label="Comment"
                  placeholder="write comment here..."
                  multiline
                  rows={6}
                  variant="filled"
                  value={description}
                  sx={{
                    width: '100%',
                  }}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      if (!isClicked) setIsClicked(true);
                      handleCreate();
                    }
                  }}
                />
                <Button
                  disabled={isClicked}
                  onClick={() => {
                    if (!isClicked) setIsClicked(true);
                    handleCreate();
                  }}
                  variant="contained"
                  sx={{
                    marginTop: '1rem',
                  }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default Comments;