<script setup>
import { reactive } from 'vue';
import { createUser } from '../services/userService';
import { useNotification } from '@kyvg/vue3-notification';

const { notify } = useNotification();

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileName: '',
    profileBase64: '',
    birthday: '',
    occupation: '',
    sex: ''
});

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: '',
    birthday: '',
    occupation: '',
    sex: '',
});

const clearErrors = () => {
    errors.firstName = "";
    errors.lastName = "";
    errors.email = "";
    errors.phone = "";
    errors.profile = "";
    errors.birthday = "";
    errors.occupation = "";
    errors.sex = "";
};

const validate = () => {
    clearErrors();
    let isValid = true;

    if (!form.firstName) {
        errors.firstName = "Please provide First Name";
        isValid = false;
    }

    if (!form.lastName) {
        errors.lastName = "Please provide Last Name";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
        errors.email = "Please provide a valid Email";
        isValid = false;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(form.phone)) {
        errors.phone = "Please provide a valid Phone";
        isValid = false;
    }

    if (!form.profileBase64) {
        errors.profile = "Please selected any profile";
        isValid = false;
    }

    if (!form.birthday) {
        errors.birthday = "Please provide a valid Birth Day";
        isValid = false;
    }

    if (!form.occupation) {
        errors.occupation = "Please selected any Occupation";
        isValid = false;
    }
    if (!form.sex) {
        errors.sex = "Please selected any Sex";
        isValid = false;
    }

    return isValid;
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const dataUrl = reader.result;
            const base64String = dataUrl.split(",")[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
};

const handleChangeProfile = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
        return;
    }

    try {
        const base64 = await fileToBase64(file);
        console.log("Base64:", base64);

        form.profileName = file.name;
        form.profileBase64 = base64;
    } catch (error) {
        console.error("Error converting file to Base64:", error);
    }

    console.log("Selected file:", form.profile);
};


const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;
    try {
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            profile: form.profileBase64,
            birthday: form.birthday,
            occupation: form.occupation,
            sex: form.sex
        }
        const res = await createUser(payload);
        console.log("Response:", res);
        if (res.status === "success") {
            notify({
                type: "success",
                title: "Success",
                text: `save data success ID: ${res.data.id}`,
            });
            handleClear();
        } else {
            notify({
                type: "error",
                title: "Error",
                text: res.message || "Create user failed",
            });
        }
    } catch (error) {
        console.error("Create user error:", error);

        const apiError = error.response?.data;
        const message = apiError?.message || apiError?.error || "Unexpected error occurred";
        console.log(message, "message");

        notify({
            type: "error",
            title: "Error",
            text: message,
        });
    }
};

const handleClear = () => {
    form.firstName = "";
    form.lastName = "";
    form.email = "";
    form.phone = "";
    form.profileName = "";
    form.profileBase64 = "";
    form.birthday = "";
    form.occupation = "";
    form.sex = "";

    clearErrors();
};

</script>

<template>
    <form class="w-5xl bg-white border-2 border-black" @submit="handleSubmit">
        <h2 class="p-1 bg-green-600 text-black border-b-2 border-black">IT 04-1</h2>
        <div class="py-4 px-8 text-black grid-cols-2 gap-4 grid">
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="first-name">First Name</label>
                <input class="p-1 w-full rounded border border-black" type="text" id="first-name"
                    placeholder="First Name" v-model="form.firstName" />
                <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="last-name">Last Name</label>
                <input class="p-1 w-full rounded border border-black" type="text" id="last-name" placeholder="Last Name"
                    v-model="form.lastName" />
                <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="email">Email</label>
                <input class="p-1 w-full rounded border border-black" type="email" id="email" placeholder="Email"
                    v-model="form.email" />
                <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="phone">Phone</label>
                <input class="p-1 w-full rounded border border-black" type="tel" id="phone" placeholder="Phone Number"
                    v-model="form.phone" />
                <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="profile">Profile</label>
                <div class="flex w-full rounded border border-black overflow-hidden">
                    <div class="flex-1 px-2 py-1 text-gray-700 text-left">
                        {{ form.profileName ? form.profileName : "No file selected" }}
                    </div>
                    <button type="button" class="px-4 py-1 bg-gray-200 hover:bg-gray-300 border-l border-black"
                        @click="$refs.profileInput.click()">
                        Browse
                    </button>
                </div>
                <input ref="profileInput" type="file" id="profile" class="hidden" @change="handleChangeProfile" />

                <span v-if="errors.profile" class="error">{{ errors.profile }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="birthday">Birthday</label>
                <input class="p-1 w-full rounded border border-black" type="date" id="birthday"
                    v-model="form.birthday"></input>
                <span v-if="errors.birthday" class="error">{{ errors.birthday }}</span>
            </div>
            <div class="px-4">
                <label class="mb-1 block text-lg text-left" for="occupation">Occupation</label>
                <select class="p-1 w-full rounded border border-black" id="occupation" v-model="form.occupation">
                    <option value="" disabled selected hidden></option>
                    <option value="developer">Software Developer</option>
                    <option value="designer">Graphic Designer</option>
                    <option value="teacher">Teacher</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="engineer">Engineer</option>
                </select>
                <span v-if="errors.occupation" class="error">{{ errors.occupation }}</span>
            </div>
            <div class="px-4 col-span-2">
                <label class="mb-1 block text-lg text-left" for="sex">Sex</label>
                <div class="p-1 flex gap-4">
                    <div>
                        <input class="bg-gray-700" type="radio" id="male" name="sex" value="male" v-model="form.sex">
                        <label for="male"> Male</label><br>
                    </div>
                    <div>
                        <input class="bg-gray-700" type="radio" id="female" name="sex" value="female"
                            v-model="form.sex">
                        <label for="female"> Female</label><br>
                    </div>
                </div>
                <span v-if="errors.sex" class="error">{{ errors.sex }}</span>
            </div>
        </div>
        <div class="">
            <button class="py-2 px-8 mb-4 ml-8 bg-green-400 hover:bg-green-700 text-white rounded cursor-pointer"
                type="submit">
                Save
            </button>
            <button class="py-2 px-8 mb-4 ml-8 bg-gray-400 hover:bg-gray-700 text-white rounded cursor-pointer"
                type="button" @click="handleClear">
                Clear
            </button>
        </div>
    </form>
</template>

<style scoped>
.error {
    color: red;
    font-size: 0.875rem;
    text-align: left;
    display: block;
}
</style>