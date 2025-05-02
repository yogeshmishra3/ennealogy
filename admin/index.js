// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyCe9mKD6-clP_Sfip4zSyN1SKUn8G5cays",
  authDomain: "analogy-64fa2.firebaseapp.com",
  projectId: "analogy-64fa2", 
  storageBucket: "analogy-64fa2.appspot.com",
  messagingSenderId: "771776371665",
  appId: "1:771776371665:web:77c5ce8c1e7017b977def0",
  measurementId: "G-33XWDFQY89"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Handle image upload
document.getElementById('uploadImageForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const file = document.getElementById('imageUpload').files[0];
  const caption = document.getElementById('imageCaption').value;

  if (!file) {
    alert('Please select an image file to upload.');
    return;
  }

  const storageRef = ref(storage, 'images/' + file.name);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  // Save the image metadata (URL and caption) to Firestore
  await addDoc(collection(db, 'images'), {
    caption: caption,
    imageUrl: imageUrl,
    createdAt: new Date()
  });

  alert('Image uploaded successfully!');
});

// Display images with Edit and Delete buttons
async function displayImages() {
  try {
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = ''; // Clear gallery before populating

    const imagesQuery = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(imagesQuery);

    querySnapshot.forEach((doc) => {
      const imageData = doc.data();

      // Create image card container
      const imageCard = document.createElement('div');
      imageCard.classList.add('image-card');

      // Create image and caption elements
      const image = document.createElement('img');
      image.src = imageData.imageUrl;

      const caption = document.createElement('p');
      caption.textContent = imageData.caption;

      // Create action buttons for each image (Edit & Delete)
      const actionButtons = document.createElement('div');
      actionButtons.classList.add('action-buttons');

      // Edit Button
      const editButton = document.createElement('button');
      editButton.textContent = "Edit Caption";
      editButton.onclick = () => editImage(doc.id, imageData);

      // Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteImage(doc.id, imageData.imageUrl);

      actionButtons.appendChild(editButton);
      actionButtons.appendChild(deleteButton);

      // Append elements to the image gallery
      imageCard.appendChild(image);
      imageCard.appendChild(caption);
      imageCard.appendChild(actionButtons);
      imageGallery.appendChild(imageCard);
    });

  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Edit image caption (do not replace the image)
async function editImage(imageId, imageData) {
  const newCaption = prompt("Enter new caption:", imageData.caption);

  // If the user cancels the prompt, do nothing
  if (newCaption === null) return;

  // Update Firestore with the new caption only
  await updateDoc(doc(db, 'images', imageId), {
    caption: newCaption || imageData.caption, // Use the new caption, or retain the old one if no new caption is provided
  });

  alert('Caption updated successfully!');
  displayImages();
}

// Delete image from Firebase Storage and Firestore
async function deleteImage(imageId, imageUrl) {
  if (!confirm("Are you sure you want to delete this image?")) return;

  try {
    // Delete image from storage
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);

    // Delete image data from Firestore
    await deleteDoc(doc(db, 'images', imageId));

    alert('Image deleted successfully!');
    displayImages();
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

// Show image gallery button functionality
document.getElementById('showImageGalleryBtn').addEventListener('click', displayImages);



// Handle video upload
document.getElementById('uploadVideoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const file = document.getElementById('videoUpload').files[0];
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;

    if (!file) {
      alert('Please select a video file to upload.');
      return;
    }

    const storageRef = ref(storage2, 'videos/' + file.name);
    await uploadBytes(storageRef, file);
    const videoUrl = await getDownloadURL(storageRef);

    // Save the video metadata (URL, title, description) to Firestore
    await addDoc(collection(db2, 'videos'), {
      title: title,
      description: description,
      videoUrl: videoUrl,
      createdAt: new Date()
    });

    alert('Video uploaded successfully!');
  });

  // Display videos with Edit and Delete buttons
  async function displayVideos() {
    try {
      const videoGallery = document.getElementById('videoGallery');
      videoGallery.innerHTML = ''; // Clear gallery before populating

      const videosQuery = query(collection(db2, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(videosQuery);

      querySnapshot.forEach((doc) => {
        const videoData = doc.data();

        // Create video card container
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        // Create video element
        const video = document.createElement('video');
        video.controls = true;
        video.src = videoData.videoUrl;

        // Create title and description elements
        const title = document.createElement('h3');
        title.textContent = videoData.title;

        const description = document.createElement('p');
        description.textContent = videoData.description;

        // Create action buttons for each video (Edit & Delete)
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        // Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.onclick = () => editVideo(doc.id, videoData);

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteVideo(doc.id, videoData.videoUrl);

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);

        // Append elements to the video gallery
        videoCard.appendChild(video);
        videoCard.appendChild(title);
        videoCard.appendChild(description);
        videoCard.appendChild(actionButtons);
        videoGallery.appendChild(videoCard);
      });

    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }

  // Edit video metadata (update title and description only)
  async function editVideo(videoId, videoData) {
    const newTitle = prompt("Enter new title:", videoData.title);
    const newDescription = prompt("Enter new description:", videoData.description);

    // Update Firestore with new title and description
    await updateDoc(doc(db2, 'videos', videoId), {
      title: newTitle || videoData.title,
      description: newDescription || videoData.description,
    });

    alert('Video metadata updated successfully!');
    displayVideos();
  }

  // Delete video from Firebase Storage and Firestore
  async function deleteVideo(videoId, videoUrl) {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      // Delete video from storage
      const videoRef = ref(storage2, videoUrl);
      await deleteObject(videoRef);

      // Delete video data from Firestore
      await deleteDoc(doc(db2, 'videos', videoId));

      alert('Video deleted successfully!');
      displayVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  }

  // Show video gallery button functionality
  document.getElementById('showVideoGalleryBtn').addEventListener('click', displayVideos);
  



  // Function to handle blog display
async function displayBlogs() {
    try {
      const blogGallery = document.getElementById('blogGallery');
      blogGallery.innerHTML = ''; // Clear gallery
  
      const blogsQuery = query(collection(db3, 'BlogsCollection'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(blogsQuery);
  
      querySnapshot.forEach((doc) => {
        const blogData = doc.data();
  
        const blogPost = document.createElement('div');
        blogPost.classList.add('blog-post');
  
        const title = document.createElement('h3');
        title.textContent = blogData.title;
  
        const theory = document.createElement('p');
        theory.textContent = blogData.theory;
  
        let mediaElement;
        if (blogData.mediaUrl) {
          if (blogData.mediaType === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = blogData.mediaUrl;
          } else if (blogData.mediaType === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = blogData.mediaUrl;
            mediaElement.controls = true;
          }
        }
  
        const actionButtons = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editBlog(doc.id, blogData);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteBlog(doc.id, blogData.mediaUrl);
  
        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);
  
        blogPost.appendChild(title);
        blogPost.appendChild(theory);
        if (mediaElement) blogPost.appendChild(mediaElement);
        blogPost.appendChild(actionButtons);
  
        blogGallery.appendChild(blogPost);
      });
    } catch (error) {
      console.error('Error displaying blogs:', error);
    }
  }
  
  // Add event listener for "Show Blog Posts" button
  document.getElementById('showBlogGalleryBtn').addEventListener('click', displayBlogs);
  